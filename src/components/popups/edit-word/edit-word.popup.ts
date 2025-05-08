import { singleton } from "tsyringe";
import { Messages } from "../../../constants/messages";
import { DictionaryService } from "../../../services/dictionary/dictionary.service";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { DictionaryTableItem } from "../../../types/DictionaryTableItem";
import { InputComponent } from "../../input/input.component";
import { PopupComponent } from "../popup.component";
import * as styles from './edit-word.popup.css';
import { ButtonComponent } from "../../button/button.component";

@singleton()
export class EditWordPopup extends PopupComponent {
    private content = document.createElement('div');
    private errorMessage = document.createElement('div');

    protected word: DictionaryTableItem | null = null;

    constructor(
        protected i18n: I18nService,
        protected translationInput: InputComponent,
        protected wordInput: InputComponent,
        protected saveButton: ButtonComponent,
        protected messenger: MessengerService,
        protected dictionaryService: DictionaryService
    ) {
        super(i18n);

        this.setTitle(i18nKeys.EditWord);
        this.setWidth("300px");

        this.content.classList.add(styles.content);
        this.saveButton.rootElement.classList.add(styles.saveButton);

        this.content.append(
            this.wordInput.rootElement,
            this.translationInput.rootElement,
            this.saveButton.rootElement,
            this.errorMessage
        );

        this.setContent(this.content);


        this.wordInput.setLabel(i18nKeys.EnterWord);
        this.translationInput.setLabel(i18nKeys.EnterTranslation);
        this.saveButton.addButtonName(i18nKeys.Save);

        this.hide();

        this.messenger.subscribe(Messages.ShowEditWordPopup, (word: DictionaryTableItem) => {
            this.clearError();

            this.word = word;

            this.initInputs();

            this.show();
        });

        this.saveButton.onClick.subscribe(this.handleEditWord.bind(this));
    }

    private initInputs() {
        this.wordInput.input.value = this.word?.word || '';
        this.translationInput.input.value = this.word?.translation || '';

        this.saveButton.disable();

        const updateButtonState = () => {
            const wordValue = this.wordInput.getValue().trim();
            const translationValue = this.translationInput.getValue().trim();

            const wordIsEmpty = wordValue.length === 0;
            const translationIsEmpty = translationValue.length === 0;

            const wordIsUnchanged = this.word && wordValue === this.word.word;
            const translationIsUnchanged = this.word && translationValue === this.word.translation;

            if (wordIsEmpty || translationIsEmpty) {
                this.saveButton.disable();
            } else if (wordIsUnchanged && translationIsUnchanged) {
                this.saveButton.disable();
            } else {
                this.saveButton.enable();
            }
        };

        this.wordInput.onChange.subscribe(() => updateButtonState());
        this.translationInput.onChange.subscribe(() => updateButtonState());
    }

    private handleEditWord() {
        this.dictionaryService.editWord({
            id: this.word?._id || '',
            word: this.wordInput.getValue(),
            translation: this.translationInput.getValue()
        }).then(() => {
            this.hide();
        }).then(() => {
            this.i18n.follow(i18nKeys.SomethingWentWrong, (value) => {
                this.errorMessage.textContent = value;
            })
        })
    }

    private clearError() {
        this.errorMessage.textContent = '';
    }

}