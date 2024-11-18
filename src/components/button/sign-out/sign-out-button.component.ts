import { injectable } from "tsyringe";
import { Messages } from "../../../constants/messages";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { ButtonComponent } from "../button.component";
import { I18nService } from "../../../services/i18n/i18n.service";
import * as styles from './sign-out-button.component.css';

@injectable()
export class SignOutButtonComponent extends ButtonComponent {
    constructor(
        protected messenger: MessengerService,
        protected i18n: I18nService
    ) {
        super(i18n);

        this.applyRootStyle(styles);
        this.addButtonName(i18nKeys.SignOut);

        this.onClick.subscribe(this.signOut.bind(this));
    }

    private signOut() {
        this.messenger.send(Messages.OpenSignOutPopup);
    }
}