import { singleton } from "tsyringe";
import * as styles from './profile-settings.component.css';
import { I18nService } from "../../../../services/i18n/i18n.service";
import { i18nKeys } from "../../../../services/i18n/i18n-keys";
import { TabContent } from "../../../tab-content/tab-content.component";
import { AuthService } from "../../../../services/auth/auth.service";
import { ChangePasswordFormComponent } from "../../../change-password-form/change-password-form.component";
import { AccountManagementComponent } from "../../../account-management/account-management.component";
import { MessengerService } from "../../../../services/messenger/messenger.service";
import { BackgroundMessages } from "../../../../constants/backgroundMessages";
import { SignInButton } from "../../../button/sign-in/sign-in.button";

@singleton()
export class ProfileSettingsComponent extends TabContent {
    private wrapper = document.createElement('div');

    private userInfoWrapper = document.createElement('div');

    private emailInfoWrapper = document.createElement('div');
    private emailLabel = document.createElement('span');
    private emailValue = document.createElement('span');

    private registrationDateInfoWrapper = document.createElement('div');
    private registrationDateLabel = document.createElement('span');
    private registrationDateValue = document.createElement('span');

    constructor(
        protected changePasswordForm: ChangePasswordFormComponent,
        protected accountManagementComponent: AccountManagementComponent,
        protected signInButton: SignInButton,
        protected authService: AuthService,
        protected i18n: I18nService,
        protected messenger: MessengerService
    ) {
        super(i18n);

        this.applyRootStyle(styles);

        this.setTitle(i18nKeys.Profile);

        this.signInButton.hide();

        this.setContent(this.signInButton.rootElement);

        this.fulfillInfo();

        this.userInfoWrapper.classList.add(styles.userInfoWrapper);
        this.emailLabel.classList.add(styles.label);
        this.registrationDateLabel.classList.add(styles.label);


        this.wrapper.classList.add(styles.wrapper);

        this.wrapper.append(
            this.userInfoWrapper,
            this.changePasswordForm.rootElement,
            this.accountManagementComponent.rootElement
        );

        this.setContent(
            this.wrapper
        );

        this.messenger.subscribeOnBackgroundMessage(BackgroundMessages.UserAuthorized, this.toggleVisibility.bind(this));
    }

    private fulfillInfo() {
        this.i18n.subscribe(i18nKeys.Email, (value: string) => {
            this.emailLabel.textContent = value + ":";
        });

        this.i18n.subscribe(i18nKeys.RegistrationDate, (value: string) => {
            this.registrationDateLabel.textContent = value + ":";
        });

        this.emailValue.textContent = "example@gmail.com";
        this.registrationDateValue.textContent = "01.01.2021";

        this.emailInfoWrapper.append(this.emailLabel, this.emailValue);
        this.registrationDateInfoWrapper.append(this.registrationDateLabel, this.registrationDateValue);

        this.userInfoWrapper.append(this.emailInfoWrapper, this.registrationDateInfoWrapper);
    }

    private toggleVisibility(data: { isAuthorized: boolean }) {
        if (data.isAuthorized) {
            this.signInButton.hide();
            this.wrapper.style.display = 'flex';
        } else {
            this.signInButton.show();
            this.wrapper.style.display = 'none';
        }
    }

}