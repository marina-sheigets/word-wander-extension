import { injectable } from "tsyringe";
import { I18nService } from "../../services/i18n/i18n.service";
import { MessengerService } from "../../services/messenger/messenger.service";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './error-message.component.css';

@injectable()
export class ErrorMessageComponent extends BaseComponent {
    private errorWrapper = document.createElement('ul');

    constructor(
        protected i18n: I18nService,
        protected messenger: MessengerService
    ) {
        super(styles);

        this.rootElement.append(this.errorWrapper);
    }

    public showErrorMessage(message: string | string[]) {
        this.errorWrapper.textContent = '';

        if (Array.isArray(message)) {
            message.forEach((msg: string) => {
                const error = document.createElement('li');
                error.textContent = msg;
                this.errorWrapper.append(error);
            });
        } else {
            const error = document.createElement('li');
            error.textContent = message;
            this.errorWrapper.append(error);
        }
    }

    public hideErrorMessage() {
        this.rootElement.style.display = 'none';
        this.errorWrapper.textContent = '';
    }
}