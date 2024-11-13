import { singleton } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './account-management.component.css';
import { I18nService } from "../../services/i18n/i18n.service";
import { i18nKeys } from "../../services/i18n/i18n-keys";
import { ButtonComponent } from "../button/button.component";

@singleton()
export class AccountManagementComponent extends BaseComponent {
    private title = document.createElement('h2');
    private buttonsWrapper = document.createElement('div');

    constructor(
        protected i18n: I18nService,
        protected signOutButton: ButtonComponent,
        protected deleteAccountButton: ButtonComponent
    ) {
        super(styles);

        this.i18n.subscribe(i18nKeys.AccountManagement, (value: string) => {
            this.title.textContent = value;
        });

        this.signOutButton.addButtonName(i18nKeys.SignOut);
        this.deleteAccountButton.addButtonName(i18nKeys.DeleteAccount);

        this.signOutButton.rootElement.classList.add(styles.signOutButton);
        this.deleteAccountButton.rootElement.classList.add(styles.deleteAccountButton);
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