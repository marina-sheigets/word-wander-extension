import { singleton } from "tsyringe";
import { PopupComponent } from "../popup.component";
import { IconService } from "../../../services/icon/icon.component";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { Messages } from "../../../constants/messages";
import { InputComponent } from "../../input/input.component";
import * as styles from './sign-in.component.css';
import { ButtonComponent } from "../../button/button.component";
import { AuthService } from "../../../services/auth/auth.service";
import { I18nService } from "../../../services/i18n/i18n.service";
import { i18nKeys } from "../../../services/i18n/i18n-keys";

@singleton()
export class SignInPopupComponent extends PopupComponent {
    private content = document.createElement('div');
    private resetPasswordWrapper = document.createElement('div');
    private resetPasswordLabel = document.createElement('div');

    constructor(
        protected iconService: IconService,
        protected messenger: MessengerService,
        protected emailInputComponent: InputComponent,
        protected passwordInputComponent: InputComponent,
        protected signInButton: ButtonComponent,
        protected authService: AuthService,
        protected resetPasswordButton: ButtonComponent,
        protected i18n: I18nService
    ) {
        super(iconService, i18n);

        this.applyRootStyle(styles);

        this.messenger.subscribe(Messages.OpenSignInPopup, this.show.bind(this));

        this.setTitle(i18nKeys.LogIn);

        this.emailInputComponent.setInputSettings('email', 'Email');
        this.emailInputComponent.setLabel('Enter your email');

        this.passwordInputComponent.setInputSettings('password', 'Password');
        this.passwordInputComponent.setLabel('Enter your password');

        this.signInButton.addButtonName('Sign in');
        this.signInButton.onClick.subscribe(this.signIn.bind(this));

        this.resetPasswordWrapper.classList.add(styles.resetPasswordWrapper);

        this.resetPasswordLabel.textContent = 'Forgot your password?';

        this.resetPasswordButton.addButtonName('Reset password');
        this.resetPasswordButton.rootElement.classList.add(styles.resetPasswordButton);
        this.resetPasswordButton.onClick.subscribe(this.resetPassword.bind(this));

        this.resetPasswordWrapper.append(
            this.resetPasswordLabel,
            this.resetPasswordButton.rootElement
        );

        this.content.classList.add(styles.content);

        this.content.append(
            this.emailInputComponent.rootElement,
            this.passwordInputComponent.rootElement,
            this.signInButton.rootElement,
            this.resetPasswordWrapper
        );

        this.setContent(this.content);

        this.hide();
    }

    private signIn() {
        this.authService.signIn(this.emailInputComponent.input.value, this.passwordInputComponent.input.value);
    }

    private resetPassword() {
        this.hide();
        this.messenger.send(Messages.OpenResetPasswordPopup);
    }
}