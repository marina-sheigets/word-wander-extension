import { singleton } from "tsyringe";
import { PopupComponent } from "../popup.component";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { Messages } from "../../../constants/messages";
import { InputComponent } from "../../input/input.component";
import * as styles from './sign-in.component.css';
import { ButtonComponent } from "../../button/button.component";
import { AuthService } from "../../../services/auth/auth.service";
import { I18nService } from "../../../services/i18n/i18n.service";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { SignInButton } from "../../button/sign-in/sign-in.button";

@singleton()
export class SignInPopupComponent extends PopupComponent {
    private content = document.createElement('div');
    private resetPasswordWrapper = document.createElement('div');
    private resetPasswordLabel = document.createElement('div');

    private authErrorWrapper = document.createElement('div');

    constructor(
        protected messenger: MessengerService,
        protected emailInputComponent: InputComponent,
        protected passwordInputComponent: InputComponent,
        protected signInButton: SignInButton,
        protected authService: AuthService,
        protected resetPasswordButton: ButtonComponent,
        protected i18n: I18nService
    ) {
        super(i18n);

        this.applyRootStyle(styles);

        this.setTitle(i18nKeys.LogIn);

        this.emailInputComponent.setInputSettings('email', i18nKeys.Email);
        this.emailInputComponent.setLabel(i18nKeys.EnterEmail);
        this.emailInputComponent.input.autocomplete = 'email';

        this.passwordInputComponent.setInputSettings('password', i18nKeys.Password);
        this.passwordInputComponent.setLabel(i18nKeys.EnterPassword);

        this.signInButton.onClick.subscribe(this.signIn.bind(this));

        this.resetPasswordWrapper.classList.add(styles.resetPasswordWrapper);
        this.authErrorWrapper.classList.add(styles.authErrorWrapper);

        this.i18n.follow(i18nKeys.ForgotPassword, (text) => {
            this.resetPasswordLabel.textContent = text;
        });

        this.resetPasswordButton.addButtonName(i18nKeys.ResetPassword);
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
            this.authErrorWrapper,
            this.resetPasswordWrapper
        );

        this.setContent(this.content);

        this.messenger.subscribe(Messages.OpenSignInPopup, this.show.bind(this));
        this.messenger.subscribe(Messages.CloseSignInPopup, this.hide.bind(this));
        this.messenger.subscribe(Messages.ShowAuthError, this.showAuthError.bind(this));

        this.hide();
    }

    private signIn() {
        this.hideAuthError();
        this.authService.signUp(this.emailInputComponent.input.value, this.passwordInputComponent.input.value);
    }

    private resetPassword() {
        this.hide();
        this.messenger.send(Messages.OpenResetPasswordPopup);
    }

    private showAuthError(message: string) {
        this.authErrorWrapper.textContent = message;
    }

    private hideAuthError() {
        this.authErrorWrapper.textContent = '';
    }

    public hide() {
        super.hide();
        this.resetCredentials();
    }

    private resetCredentials() {
        this.emailInputComponent.clear();
        this.passwordInputComponent.clear();
    }
}