import { singleton } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './account-management.component.css';
import { I18nService } from "../../services/i18n/i18n.service";
import { i18nKeys } from "../../services/i18n/i18n-keys";
import { SignOutButtonComponent } from "../button/sign-out/sign-out-button.component";
import { DeleteAccountButtonComponent } from "../button/delete-account/delete-account-button.component";

@singleton()
export class AccountManagementComponent extends BaseComponent {
    private title = document.createElement('h2');
    private buttonsWrapper = document.createElement('div');

    constructor(
        protected i18n: I18nService,
        protected signOutButton: SignOutButtonComponent,
        protected deleteAccountButton: DeleteAccountButtonComponent
    ) {
        super(styles);

        this.i18n.subscribe(i18nKeys.AccountManagement, (value: string) => {
            this.title.textContent = value;
        });

        this.buttonsWrapper.classList.add(styles.wrapper);

        this.buttonsWrapper.append(
            this.signOutButton.rootElement,
            this.deleteAccountButton.rootElement
        );

        this.rootElement.append(
            this.title,
            this.buttonsWrapper
        );
    }
}