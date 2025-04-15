import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './word-list.component.css';
import { i18nKeys } from "../../services/i18n/i18n-keys";
import { I18nService } from "../../services/i18n/i18n.service";
import { DictionaryTableItem } from "../../types/DictionaryTableItem";
import { CheckboxComponent } from "../checkbox/checkbox.component";
import { ButtonComponent } from "../button/button.component";
import { IconName } from "../../types/IconName";
import { ComponentsFactory } from "../factories/component.factory.";
import { TextToSpeechService } from "../../services/text-to-speech/text-to-speech.service";
import { DictionaryService } from "../../services/dictionary/dictionary.service";

@injectable()
export class WordListComponent extends BaseComponent {
    private periodLabel = document.createElement("h3");
    private listOfWords = document.createElement("div");

    //public onSelectedChange = new Informer();


    private words: DictionaryTableItem[] = [];
    private initialData: DictionaryTableItem[] = [];

    constructor(
        protected i18n: I18nService,
        protected textToSpeechService: TextToSpeechService,
        protected dictionaryService: DictionaryService,
        protected componentsFactory: ComponentsFactory
    ) {
        super(styles);

        this.rootElement.append(
            this.periodLabel,
            this.listOfWords
        );
    }


    setPeriodLabel(key: i18nKeys) {
        this.i18n.follow(key, (value) => {
            this.periodLabel.textContent = value;
        })
    }

    setInitialWords(words: DictionaryTableItem[]) {
        this.initialData = words;
        this.setListOfWords(words)
    }

    setListOfWords(words?: DictionaryTableItem[]) {
        this.words = words || this.initialData;

        this.listOfWords.textContent = '';

        this.words.forEach((item) => {
            const checkbox = this.componentsFactory.createComponent(CheckboxComponent);
            checkbox.setName(item._id);
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
            removeWordIcon.rootElement.id = "delete-word-icon-" + item._id;

            this.listOfWords.append(
                checkbox.rootElement,
                playWordIcon.rootElement,
                wordContainer,
                translationContainer,
                removeWordIcon.rootElement
            );
        })
    }

    protected updateTableDataSelected(checkbox: HTMLInputElement) {
        const selectedId = checkbox.name;

        this.words.forEach((item) => {
            if (item._id === selectedId) {
                item.selected = checkbox.checked;
            }
        });

        this.initialData.forEach((item) => {
            if (item._id === selectedId) {
                item.selected = checkbox.checked;
            }
        });

        // this.onSelectedChange.inform();
    }

    private async handleRemoveWord(item: DictionaryTableItem) {
        await this.dictionaryService.removeWordFromDictionary(item._id);

        this.words = this.words.filter((tableItem) => tableItem._id !== item._id);
        this.initialData = this.initialData.filter((tableItem) => tableItem._id !== item._id);

        this.setListOfWords();

        // this.onSelectedChange.inform(this.tableData);
        //this.dictionaryService.onDataChanged.inform(this.tableData);
    }


}