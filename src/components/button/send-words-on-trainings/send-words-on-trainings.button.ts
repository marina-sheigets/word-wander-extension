import { singleton } from "tsyringe";
import { Messages } from "../../../constants/messages";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { ButtonComponent } from "../button.component";
import { DictionaryService } from "../../../services/dictionary/dictionary.service";

@singleton()
export class SendWordsOnTrainingButton extends ButtonComponent {

    constructor(
        protected i18n: I18nService,
        protected messenger: MessengerService,
        protected dictionaryService: DictionaryService
    ) {
        super(i18n);

        this.addButtonName(i18nKeys.SendOnTraining);

        this.onClick.subscribe(this.handleButtonClicked.bind(this));

        this.disable();

        this.dictionaryService.onSelectedWordsChanged.subscribe(this.handleDisableButton.bind(this))
    }

    protected handleButtonClicked() {
        this.messenger.send(Messages.SendWordsOnTrainingPopup);
    }

    protected handleDisableButton() {
        if (this.dictionaryService.getSelectedWordsIds().length === 0) {
            this.disable();
        } else {
            this.enable();
        }
    }
}