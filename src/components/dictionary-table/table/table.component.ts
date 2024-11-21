import { singleton } from "tsyringe";
import { I18nService } from "../../../services/i18n/i18n.service";
import { IconName } from "../../../types/IconName";
import { BaseComponent } from "../../base-component/base-component";
import { ButtonComponent } from "../../button/button.component";
import { CheckboxComponent } from "../../checkbox/checkbox.component";
import * as styles from "./table.component.css";
import { Informer } from "../../../services/informer/informer.service";
import { TextToSpeechService } from "../../../services/text-to-speech/text-to-speech.service";
import { DictionaryService } from "../../../services/dictionary/dictionary.service";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { DictionaryTableItem } from "../../../types/DictionaryTableItem";
import { SettingsService } from "../../../services/settings/settings.service";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { Messages } from "../../../constants/messages";
import { SettingsNames } from "../../../constants/settingsNames";
import { LoaderComponent } from "../../loader/loader.component";

@singleton()
export class TableComponent extends BaseComponent {
    public onSelectedChange = new Informer();

    private tableData: DictionaryTableItem[] = [];

    constructor(
        protected i18n: I18nService,
        protected textToSpeechService: TextToSpeechService,
        protected dictionaryService: DictionaryService,
        protected settingsService: SettingsService,
        protected messenger: MessengerService,
        protected loader: LoaderComponent
    ) {
        super(styles);

        this.messenger.subscribe(Messages.WordAddedToDictionary, (word: DictionaryTableItem) => {
            this.tableData.push(word);
            this.initTable();
        });

        this.dictionaryService.onDataChanged.subscribe(this.initTable.bind(this));

        this.settingsService.subscribe(SettingsNames.User, async () => {
            this.tableData = await this.dictionaryService.fetchDictionary();
            this.loader.hide();
        });

        this.loader.show();
        this.rootElement.append(this.loader.rootElement);
    }


    private async initTable(data?: DictionaryTableItem[]) {
        this.tableData = data || this.tableData;

        this.rootElement.textContent = '';
        if (!this.tableData.length) {
            this.i18n.subscribe(i18nKeys.EmptyDictionary, (value: string) => {
                this.rootElement.textContent = value;
            });
            return;
        }

        this.tableData.forEach((item) => {
            const checkbox = new CheckboxComponent(item.id);
            const removeWordIcon = new ButtonComponent(this.i18n);

            const playWordIcon = new ButtonComponent(this.i18n);
            playWordIcon.rootElement.classList.add(styles.playWordIcon);
            playWordIcon.addButtonIcon(IconName.MusicNote);
            playWordIcon.onClick.subscribe(() => {
                this.textToSpeechService.play(item.word);
            })

            const wordContainer = document.createElement('div');
            wordContainer.classList.add(styles.wordContainer);
            wordContainer.textContent = item.word;

            const translationContainer = document.createElement('div');
            translationContainer.classList.add(styles.translationContainer);
            translationContainer.textContent = item.translation;

            checkbox.onCheckboxChange.subscribe(this.updateTableDataSelected.bind(this))
            removeWordIcon.addButtonIcon(IconName.Delete);
            removeWordIcon.onClick.subscribe(async () => {
                this.handleRemoveWord(item);
            });
            removeWordIcon.rootElement.id = "delete-word-icon-" + item.id;

            this.rootElement.append(
                checkbox.rootElement,
                playWordIcon.rootElement,
                wordContainer,
                translationContainer,
                removeWordIcon.rootElement
            );

        });
    }

    protected updateTableDataSelected(checkbox: HTMLInputElement) {
        const selectedId = checkbox.name;

        this.tableData.forEach((item) => {
            if (item.id === selectedId) {
                item.selected = checkbox.checked;
            }
        });

        this.onSelectedChange.inform();
    }

    public getTableData() {
        return this.tableData;
    }

    public toggleSelectAllWords(allSelected: boolean) {
        const checkboxes = this.rootElement.querySelectorAll('input[type=checkbox]');
        checkboxes.forEach((elem: HTMLInputElement) => elem.checked = allSelected);

        this.tableData.forEach(item => item.selected = allSelected);
        this.onSelectedChange.inform();
    }

    private async handleRemoveWord(item: DictionaryTableItem) {
        await this.dictionaryService.removeWordFromDictionary(item.id);
        this.tableData = this.tableData.filter((tableItem) => tableItem.id !== item.id);
        this.initTable();
        this.onSelectedChange.inform(this.tableData);
    }
}