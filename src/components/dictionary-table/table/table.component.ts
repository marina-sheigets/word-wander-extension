import { singleton } from "tsyringe";
import { I18nService } from "../../../services/i18n/i18n.service";
import { IconName } from "../../../types/IconName";
import { BaseComponent } from "../../base-component/base-component";
import { ButtonComponent } from "../../button/button.component";
import { CheckboxComponent } from "../../checkbox/checkbox.component";
import * as styles from "./table.component.css";
import { Informer } from "../../../services/informer/informer.service";
import { TextToSpeechService } from "../../../services/text-to-speech/text-to-speech.service";

@singleton()
export class TableComponent extends BaseComponent {
    public onSelectedChange = new Informer();

    private tableData = [
        {
            id: "1",
            word: 'word',
            translation: 'translation',
            selected: false,
        },
        {
            id: "2",
            word: 'word',
            translation: 'translation',
            selected: false,
        },
        {
            id: "3",
            word: 'word',
            translation: 'translation',
            selected: false,
        },
    ]
    constructor(
        protected i18n: I18nService,
        protected textToSpeechService: TextToSpeechService
    ) {
        super(styles);

        this.initTable()
    }

    private initTable() {
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


}