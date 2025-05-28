import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './word-row.component.css';
import { ComponentsFactory } from "../factories/component.factory.";
import { CheckboxComponent } from "../checkbox/checkbox.component";
import { ButtonComponent } from "../button/button.component";
import { IconName } from "../../types/IconName";
import { TextToSpeechService } from "../../services/text-to-speech/text-to-speech.service";
import { CollectionsLabelComponent } from "../collections-label/collections-label.component";
import { EditWordIconComponent } from "../icon/edit-word-icon/edit-word-icon.component";
import { RemoveWordIconComponent } from "../icon/remove-word-icon/remove-word-icon.component";
import { DictionaryTableItem } from "../../types/DictionaryTableItem";
import { Informer } from "../../services/informer/informer.service";

@injectable()
export class WordRowComponent extends BaseComponent {
    public updateTableDataSelected = new Informer<HTMLInputElement>();

    private word: DictionaryTableItem | null = null;

    constructor(
        private componentsFactory: ComponentsFactory,
        private textToSpeechService: TextToSpeechService
    ) {
        super(styles);
    }

    public setWord(word: DictionaryTableItem) {
        this.word = word;

        this.displayWord();
    }

    private displayWord() {
        if (!this.word) {
            return;
        }

        const checkbox = this.componentsFactory.createComponent(CheckboxComponent);
        checkbox.setName(this.word._id);
        checkbox.setChecked(this.word.selected);

        const playWordIcon = this.componentsFactory.createComponent(ButtonComponent);

        playWordIcon.rootElement.classList.add(styles.playWordIcon);
        playWordIcon.addButtonIcon(IconName.MusicNote);
        playWordIcon.onClick.subscribe(() => {
            this.textToSpeechService.play(this.word?.word || '');
        });

        const wordContainer = document.createElement('div');
        wordContainer.classList.add(styles.wordContainer);
        wordContainer.textContent = this.word.word;

        const translationContainer = document.createElement('div');
        translationContainer.classList.add(styles.translationContainer);
        translationContainer.textContent = this.word.translation;

        checkbox.onCheckboxChange.subscribe(() => this.updateTableDataSelected.inform(checkbox.checkbox as HTMLInputElement));

        const collectionsLabel = this.componentsFactory.createComponent(CollectionsLabelComponent);
        collectionsLabel.setCollections(this.word.collections, 30);


        const editWordIcon = this.componentsFactory.createComponent(EditWordIconComponent);
        editWordIcon.setWord(this.word);

        const removeWordButton = this.componentsFactory.createComponent(RemoveWordIconComponent);
        removeWordButton.setWord(this.word);

        this.rootElement.append(
            checkbox.rootElement,
            playWordIcon.rootElement,
            wordContainer,
            translationContainer,
            collectionsLabel.rootElement,
            editWordIcon.rootElement,
            removeWordButton.rootElement
        );
    }
}