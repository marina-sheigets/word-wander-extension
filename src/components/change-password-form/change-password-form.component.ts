import { singleton } from "tsyringe";
import { i18nKeys } from "../../services/i18n/i18n-keys";
import { I18nService } from "../../services/i18n/i18n.service";
import { BaseComponent } from "../base-component/base-component";
import { ButtonComponent } from "../button/button.component";
import { InputComponent } from "../input/input.component";
import * as styles from './change-password-form.component.css';
import { AuthService } from "../../services/auth/auth.service";
import { ErrorMessageComponent } from "../error-message/error-message.component";
import { SuccessMessageComponent } from "../success-message/success-message.component";

@singleton()
export class ChangePasswordFormComponent extends BaseComponent {
    private title = document.createElement('h2');
    private inputsWrapper = document.createElement('div');
    private buttonsWrapper = document.createElement('div');

    constructor(
        protected i18n: I18nService,
        protected currentPasswordInput: InputComponent,
        protected newPasswordInput: InputComponent,
        protected saveButton: ButtonComponent,
        protected cancelButton: ButtonComponent,
        protected authService: AuthService,
        protected errorMessage: ErrorMessageComponent,
        protected successMessage: SuccessMessageComponent
    ) {
        super(styles);

        this.i18n.subscribe(i18nKeys.ChangePassword, (value: string) => {
            this.title.textContent = value;
        });

        this.currentPasswordInput.setLabel(i18nKeys.CurrentPassword);
        this.newPasswordInput.setLabel(i18nKeys.NewPassword);

        this.currentPasswordInput.input.type = 'password';
        this.newPasswordInput.input.type = 'password';

        this.saveButton.addButtonName(i18nKeys.Save);
        this.cancelButton.addButtonName(i18nKeys.Cancel);
        this.cancelButton.rootElement.classList.add(styles.cancelButton);

        this.saveButton.disable();

        this.inputsWrapper.classList.add(styles.wrapper);
        this.buttonsWrapper.classList.add(styles.wrapper);

        this.inputsWrapper.append(
            this.currentPasswordInput.rootElement,
            this.newPasswordInput.rootElement
        );

        this.buttonsWrapper.append(
            this.saveButton.rootElement,
            this.cancelButton.rootElement
        );

        this.rootElement.append(
            this.title,
            this.inputsWrapper,
            this.errorMessage.rootElement,
            this.successMessage.rootElement,
            this.buttonsWrapper
        );

        this.currentPasswordInput.onChange.subscribe(this.toggleButtonsState.bind(this));
        this.newPasswordInput.onChange.subscribe(this.toggleButtonsState.bind(this));

        this.saveButton.onClick.subscribe(this.savePassword.bind(this));
        this.cancelButton.onClick.subscribe(this.reset.bind(this));
    }

    private toggleButtonsState() {
        if (this.currentPasswordInput.input.value.length && this.newPasswordInput.input.value.length) {
            this.saveButton.enable();
        } else {
            this.saveButton.disable();
        }
    }

    private savePassword() {
        const currentPassword = this.currentPasswordInput.getValue();
        const newPassword = this.newPasswordInput.getValue();

        this.saveButton.disable();
        this.authService.changePassword(currentPassword, newPassword)
            .then(() => {
                this.successMessage.setMessage(i18nKeys.PasswordChanged);
                this.reset();
            }).catch((e) => {
                if (e.response && e.response?.data?.message) {
                    this.errorMessage.showErrorMessage(e.response.data.message);
                }
            }).finally(() => {
                this.saveButton.enable();
            });
    }

    private reset() {
        this.errorMessage.hideErrorMessage();
        this.currentPasswordInput.clear();
        this.newPasswordInput.clear();
        this.saveButton.disable();
    }
}