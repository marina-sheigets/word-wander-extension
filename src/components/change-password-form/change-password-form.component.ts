import { singleton } from "tsyringe";
import { i18nKeys } from "../../services/i18n/i18n-keys";
import { I18nService } from "../../services/i18n/i18n.service";
import { BaseComponent } from "../base-component/base-component";
import { ButtonComponent } from "../button/button.component";
import { InputComponent } from "../input/input.component";
import * as styles from './change-password-form.component.css';

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
        protected cancelButton: ButtonComponent
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
            this.buttonsWrapper
        );
    }
}