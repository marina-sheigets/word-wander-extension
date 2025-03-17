import { singleton } from "tsyringe";
import { Messages } from "../../../constants/messages";
import { DictionaryService } from "../../../services/dictionary/dictionary.service";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { SubmitButton } from "../../button/submit/submit-button.component";
import { InputComponent } from "../../input/input.component";
import { PopupComponent } from "../popup.component";
import * as styles from './custom-translation.popup.css';

@singleton()
export class CustomTranslationPopup extends PopupComponent {
    private content = document.createElement('div');

    constructor(
        protected i18n: I18nService,
        protected messenger: MessengerService,
        protected translationInput: InputComponent,
        protected wordInput: InputComponent,
        protected submitButton: SubmitButton,
        protected dictionaryService: DictionaryService
    ) {
        super(i18n);

        this.setTitle(i18nKeys.AddCustomTranslation);

        this.content.classList.add(styles.content);

        this.initContent();

        this.content.append(
            this.wordInput.rootElement,
            this.translationInput.rootElement,
            this.submitButton.rootElement,
        );

        this.setContent(this.content);

        this.wordInput.onChange.subscribe(this.toggleButtonDisabling.bind(this));
        this.translationInput.onChange.subscribe(this.toggleButtonDisabling.bind(this));

        this.toggleButtonDisabling();

        this.submitButton.onClick.subscribe(this.saveWordToDictionary.bind(this));
        this.messenger.subscribe(Messages.OpenCustomTranslationPopup, this.show.bind(this));

        this.hide();
    }


    private initContent() {
        this.wordInput.setLabel(i18nKeys.EnterWord);
        this.wordInput.setInputSettings("text", i18nKeys.EnterWord);

        this.translationInput.setLabel(i18nKeys.EnterTranslation);
        this.translationInput.setInputSettings("text", i18nKeys.EnterTranslation);

        this.submitButton.addButtonName(i18nKeys.Save);
    }

    private toggleButtonDisabling() {
        if (this.wordInput.getValue().trim() && this.translationInput.getValue().trim()) {
            this.submitButton.enable();
        } else {
            this.submitButton.disable();

        }
    }

    private saveWordToDictionary() {
        const word = this.wordInput.getValue().trim();
        const translation = this.translationInput.getValue().trim();

        this.dictionaryService.addWordToDictionary(word, translation).finally(() => {
            this.hide();
        })
    }

    public hide() {
        this.wordInput.clear();
        this.translationInput.clear();

        super.hide();
    }
}