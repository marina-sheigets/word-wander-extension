import { singleton } from "tsyringe";
import { PopupComponent } from "../popup.component";
import { IconService } from "../../../services/icon/icon.component";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { Messages } from "../../../constants/messages";
import { InputComponent } from "../../input/input.component";
import * as styles from './sign-in.component.css';
import { ButtonComponent } from "../../button/button.component";
import { AuthService } from "../../../services/auth/auth.service";

@singleton()
export class SignInPopupComponent extends PopupComponent {
    private content = document.createElement('div');

    constructor(
        protected iconService: IconService,
        protected messenger: MessengerService,
        protected emailInputComponent: InputComponent,
        protected passwordInputComponent: InputComponent,
        protected signInButton: ButtonComponent,
        protected authService: AuthService
    ) {
        super(iconService);

        this.applyRootStyle(styles);

        this.messenger.subscribe(Messages.OpenSignInPopup, this.show.bind(this));

        this.setTitle('Log in');

        this.emailInputComponent.setInputSettings('email', 'Email');
        this.emailInputComponent.setLabel('Enter your email');

        this.passwordInputComponent.setInputSettings('password', 'Password');
        this.passwordInputComponent.setLabel('Enter your password');

        this.signInButton.addButtonName('Sign in');
        this.signInButton.onClick.subscribe(this.signIn.bind(this));

        this.content.classList.add(styles.content);

        this.content.append(
            this.emailInputComponent.rootElement,
            this.passwordInputComponent.rootElement,
            this.signInButton.rootElement
        );

        this.setContent(this.content);

        this.hide();
    }

    private signIn() {
        this.authService.signIn(this.emailInputComponent.input.value, this.passwordInputComponent.input.value);
    }
}