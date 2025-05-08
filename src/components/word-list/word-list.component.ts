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
import { IconComponent } from "../icon/icon.component";
import { CollectionsLabelComponent } from "../collections-label/collections-label.component";

@injectable()
export class WordListComponent extends BaseComponent {
    private periodRaw = document.createElement("div");
    private periodLabel = document.createElement("h3");
    private listOfWords = document.createElement("div");

    private words: DictionaryTableItem[] = [];
    private initialData: DictionaryTableItem[] = [];

    constructor(
        protected i18n: I18nService,
        protected textToSpeechService: TextToSpeechService,
        protected dictionaryService: DictionaryService,
        protected componentsFactory: ComponentsFactory,
        protected selectAllWordsCheckbox: CheckboxComponent,
        protected arrowIcon: IconComponent
    ) {
        super(styles);

        this.listOfWords.classList.add(styles.listOfWords);
        this.periodRaw.classList.add(styles.periodRaw);

        this.arrowIcon.setIcon(IconName.ChevronDown);

        this.arrowIcon.rootElement.addEventListener('click', this.toggleWordListVisibility.bind(this));
        this.arrowIcon.rootElement.classList.add(styles.wordListVisible);

        this.periodRaw.append(
            this.selectAllWordsCheckbox.rootElement,
            this.arrowIcon.rootElement,
            this.periodLabel
        );

        this.rootElement.append(
            this.periodRaw,
            this.listOfWords
        );


        this.selectAllWordsCheckbox.onCheckboxChange.subscribe((elem: HTMLInputElement) => this.toggleSelectAllWords(elem.checked));
    }

    setPeriodLabel(key: i18nKeys) {
        this.i18n.follow(key, (value) => {
            this.periodLabel.textContent = value;
        })
    }

    setData(headerLabel: i18nKeys, words: DictionaryTableItem[]) {
        this.initialData = words;

        this.setPeriodLabel(headerLabel);
        this.setListOfWords(words)
    }

    private setListOfWords(words?: DictionaryTableItem[]) {
        this.words = words || this.initialData;

        this.listOfWords.textContent = '';

        this.words.forEach((item) => {
            const checkbox = this.componentsFactory.createComponent(CheckboxComponent);
            checkbox.setName(item._id);
            checkbox.setChecked(item.selected);

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

            checkbox.onCheckboxChange.subscribe(this.updateTableDataSelected.bind(this));

            const collectionsLabel = this.componentsFactory.createComponent(CollectionsLabelComponent);
            collectionsLabel.setCollections(item.collections, 30);

            this.listOfWords.append(
                checkbox.rootElement,
                playWordIcon.rootElement,
                wordContainer,
                translationContainer,
                collectionsLabel.rootElement
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

        this.toggleHeaderCheckboxSelected();
        this.toggleSelectedWordIdsInDictionaryService(checkbox.checked, [selectedId]);
    }

    private toggleSelectedWordIdsInDictionaryService(checked: boolean, selectedIds: string[]) {
        if (checked) {
            this.dictionaryService.addSelectedWords(selectedIds);
        } else {
            this.dictionaryService.filterUnselectedWords(selectedIds);
        }
    }

    private toggleHeaderCheckboxSelected() {
        if (this.words.every(word => !word.selected)) {
            this.selectAllWordsCheckbox.setChecked(false);
            this.selectAllWordsCheckbox.setIndeterminate(false);
            return;
        }

        if (this.words.every(word => word.selected)) {
            this.selectAllWordsCheckbox.setChecked(true);
            this.selectAllWordsCheckbox.setIndeterminate(false);
            return;
        }

        if (this.words.some(word => word.selected)) {
            this.selectAllWordsCheckbox.setChecked(false);
            this.selectAllWordsCheckbox.setIndeterminate(true);
            return;
        }
    }

    private toggleWordListVisibility() {
        if (this.isWordListHidden()) {
            this.arrowIcon.rootElement.classList.add(styles.wordListVisible);
            this.show();
        } else {
            this.arrowIcon.rootElement.classList.remove(styles.wordListVisible);
            this.hide();
        }
    }

    private show() {
        this.listOfWords.classList.remove(styles.hidden)
    }

    private hide() {
        this.listOfWords.classList.add(styles.hidden)
    }

    private isWordListHidden() {
        return this.listOfWords.classList.contains(styles.hidden);
    }

    public unselectAllWords() {
        this.toggleSelectAllWords(false);
    }

    private toggleSelectAllWords(allSelected: boolean) {
        const checkboxes = this.listOfWords.querySelectorAll('input[type=checkbox]');
        checkboxes.forEach((elem: HTMLInputElement) => elem.checked = allSelected);

        this.words.forEach(item => item.selected = allSelected);
        this.initialData.forEach(item => item.selected = allSelected);

        const wordsIds = this.words.map((word) => word._id);

        this.toggleSelectedWordIdsInDictionaryService(allSelected, wordsIds);
        this.toggleHeaderCheckboxSelected();
    }

}