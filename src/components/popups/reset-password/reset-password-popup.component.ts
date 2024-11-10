import { singleton } from "tsyringe";
import { PopupComponent } from "../popup.component";
import * as styles from './reset-password-popup.component.css';
import { InputComponent } from "../../input/input.component";
import { ButtonComponent } from "../../button/button.component";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { Messages } from "../../../constants/messages";
import { I18nService } from "../../../services/i18n/i18n.service";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { AuthService } from "../../../services/auth/auth.service";

@singleton()
export class ResetPasswordPopupComponent extends PopupComponent {
    private description = document.createElement('div');

    private errorMessageWrapper = document.createElement('div');

    constructor(
        protected emailInput: InputComponent,
        protected submitButton: ButtonComponent,
        protected messenger: MessengerService,
        protected i18n: I18nService,
        protected authService: AuthService
    ) {
        super(i18n);
        this.applyRootStyle(styles);

        this.setTitle(i18nKeys.ResetPassword);

        this.i18n.follow(i18nKeys.ResetPasswordDescription, (text) => {
            this.description.textContent = text;
        });

        this.errorMessageWrapper.classList.add(styles.errorMessageWrapper);
        this.description.classList.add(styles.description);

        this.emailInput.setInputSettings('email', i18nKeys.Email);

        this.submitButton.addButtonName(i18nKeys.Submit);
        this.submitButton.rootElement.classList.add(styles.submitButton);
        this.submitButton.onClick.subscribe(this.handleResetPassword.bind(this));

        this.setContent(this.description);
        this.setContent(this.emailInput.rootElement);
        this.setContent(this.errorMessageWrapper);
        this.setContent(this.submitButton.rootElement);

        this.hide();

        this.messenger.subscribe(Messages.OpenResetPasswordPopup, this.show.bind(this));
        this.messenger.subscribe(Messages.CloseResetPasswordPopup, this.hide.bind(this));
    }

    private handleResetPassword() {
        this.authService.resetPassword(this.emailInput.getValue())
            .then(() => {
                this.errorMessageWrapper.textContent = '';
                this.hide();
                this.messenger.send(Messages.ResetPasswordLinkSent);
                this.emailInput.clear();
            })
            .catch((e) => {
                const errorText = e.code === "ERR_BAD_REQUEST" ? i18nKeys.InvalidEmail : i18nKeys.SomethingWentWrong;

                this.i18n.follow(errorText, (text) => {
                    this.errorMessageWrapper.textContent = text;
                });
            });

    }
}