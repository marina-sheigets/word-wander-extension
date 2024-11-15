import { injectable } from "tsyringe";
import { Messages } from "../../../constants/messages";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { ButtonComponent } from "../button.component";

@injectable()
export class SignInButton extends ButtonComponent {
    constructor(
        protected messengerService: MessengerService,
        protected i18nService: I18nService
    ) {
        super(i18nService);

        this.addButtonName(i18nKeys.SignIn);
        this.onClick.subscribe(this.openSignInPopup.bind(this));
    }

    openSignInPopup() {
        this.messengerService.send(Messages.OpenSignInPopup);
    }
}