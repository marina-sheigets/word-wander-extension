import { injectable } from "tsyringe";
import { Messages } from "../../../constants/messages";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { ButtonComponent } from "../button.component";
import * as styles from './delete-account-button.component.css';

@injectable()
export class DeleteAccountButtonComponent extends ButtonComponent {
    constructor(
        protected i18n: I18nService,
        protected messenger: MessengerService
    ) {
        super(i18n);

        this.applyRootStyle(styles);

        this.addButtonName(i18nKeys.DeleteAccount);

        this.onClick.subscribe(this.handleDeleteAccount.bind(this));
    }

    private handleDeleteAccount() {
        this.messenger.send(Messages.ShowDeleteAccountPopup);
    }
}