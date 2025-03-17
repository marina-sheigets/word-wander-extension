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
import { SettingsNames } from "../../../constants/settingsNames";
import { LoaderComponent } from "../../loader/loader.component";
import { AuthorizationData } from "../../../types/AuthorizationData";
import { BackgroundMessages } from "../../../constants/backgroundMessages";
import { ComponentsFactory } from "../../factories/component.factory.";
import { NotFoundComponent } from "../../not-found/not-found.component";

@singleton()
export class TableComponent extends BaseComponent {
    public onSelectedChange = new Informer();

    private tableContainer = document.createElement('div');

    private tableData: DictionaryTableItem[] = [];
    private initialData: DictionaryTableItem[] = [];

    constructor(
        protected i18n: I18nService,
        protected textToSpeechService: TextToSpeechService,
        protected dictionaryService: DictionaryService,
        protected settingsService: SettingsService,
        protected messenger: MessengerService,
        protected loader: LoaderComponent,
        protected componentsFactory: ComponentsFactory,
        protected notFoundComponent: NotFoundComponent
    ) {
        super(styles);

        chrome.runtime?.onMessage?.addListener(async (request) => {
            if (
                request.type === BackgroundMessages.DictionarySync ||
                (request.message && request.message === BackgroundMessages.DictionarySync)
            ) {
                this.initialData = await this.dictionaryService.fetchDictionary();
                this.initTable();
            }
        });

        this.tableContainer.classList.add(styles.tableContainer);

        this.dictionaryService.onDataChanged.subscribe(this.initTable.bind(this));

        this.settingsService.subscribe(SettingsNames.User, async (userData: AuthorizationData) => {
            if (!userData) return;
            this.initialData = await this.dictionaryService.fetchDictionary();
            this.loader.hide();
        });

        this.loader.show();
        this.rootElement.append(
            this.tableContainer,
            this.loader.rootElement,
            this.notFoundComponent.rootElement
        );
    }


    private async initTable(data?: DictionaryTableItem[]) {
        this.notFoundComponent.hide();
        this.tableContainer.classList.remove(styles.hidden);
        this.tableData = data || this.initialData;

        this.tableContainer.textContent = '';
        if (!this.tableData.length) {
            this.i18n.subscribe(i18nKeys.EmptyDictionary, (value: string) => {
                this.tableContainer.textContent = value;
            });
            return;
        }

        this.tableData.forEach((item) => {
            const checkbox = this.componentsFactory.createComponent(CheckboxComponent);
            checkbox.setName(item.id);
            checkbox.setChecked(item.selected);

            const removeWordIcon = this.componentsFactory.createComponent(ButtonComponent);

            const playWordIcon = this.componentsFactory.createComponent(ButtonComponent);

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

            this.tableContainer.append(
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

        this.initialData.forEach((item) => {
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
        const checkboxes = this.tableContainer.querySelectorAll('input[type=checkbox]');
        checkboxes.forEach((elem: HTMLInputElement) => elem.checked = allSelected);

        this.tableData.forEach(item => item.selected = allSelected);
        this.initialData.forEach(item => item.selected = allSelected);

        this.onSelectedChange.inform();
    }

    private async handleRemoveWord(item: DictionaryTableItem) {
        await this.dictionaryService.removeWordFromDictionary(item.id);

        this.tableData = this.tableData.filter((tableItem) => tableItem.id !== item.id);
        this.initialData = this.initialData.filter((tableItem) => tableItem.id !== item.id);

        this.initTable();

        this.onSelectedChange.inform(this.tableData);
        this.dictionaryService.onDataChanged.inform(this.tableData);
    }

    public filterWords(value: string) {
        if (!value) {
            this.initTable();
            return;
        }

        const filteredData = this.initialData.filter((item) => item.word.toLowerCase().includes(value.toLowerCase()));

        if (!filteredData.length) {
            this.displayEmptyResult();
            return;
        }

        this.initTable(filteredData);
    }

    private displayEmptyResult() {
        this.tableContainer.classList.add(styles.hidden);

        this.notFoundComponent.setTitle(i18nKeys.WordsNotFound);
        this.notFoundComponent.setDescription(i18nKeys.TryAnotherPrompt);
        this.notFoundComponent.show();
    }

}