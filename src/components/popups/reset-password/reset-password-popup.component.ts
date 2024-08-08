import { singleton } from "tsyringe";
import { IconService } from "../../../services/icon/icon.component";
import { PopupComponent } from "../popup.component";
import * as styles from './reset-password-popup.component.css';
import { InputComponent } from "../../input/input.component";
import { ButtonComponent } from "../../button/button.component";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { Messages } from "../../../constants/messages";

@singleton()
export class ResetPasswordPopupComponent extends PopupComponent {
    private description = document.createElement('div');

    constructor(
        protected iconService: IconService,
        protected emailInput: InputComponent,
        protected submitButton: ButtonComponent,
        protected messenger: MessengerService
    ) {
        super(iconService);
        this.applyRootStyle(styles);

        this.setTitle('Reset Password');

        this.description.textContent = 'Enter your email address and we will send you a link to reset your password';
        this.description.classList.add(styles.description);

        this.emailInput.setInputSettings('email', 'Email');

        this.submitButton.addButtonName('Submit');
        this.submitButton.rootElement.classList.add(styles.submitButton);

        this.setContent(this.description);
        this.setContent(this.emailInput.rootElement);
        this.setContent(this.submitButton.rootElement);

        this.hide();

        this.messenger.subscribe(Messages.OpenResetPasswordPopup, this.show.bind(this));
    }
}