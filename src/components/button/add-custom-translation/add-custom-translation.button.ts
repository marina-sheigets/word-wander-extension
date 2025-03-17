import { injectable } from "tsyringe";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { ButtonComponent } from "../button.component";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { Messages } from "../../../constants/messages";

@injectable()
export class AddCustomTranslationButton extends ButtonComponent {

    constructor(
        protected i18n: I18nService,
        protected messenger: MessengerService,

    ) {
        super(i18n);

        this.addButtonName(i18nKeys.AddCustomTranslation);

        this.onClick.subscribe(this.showCustomTranslationPopup.bind(this));
    }

    private showCustomTranslationPopup() {
        this.messenger.send(Messages.OpenCustomTranslationPopup);
    }
}