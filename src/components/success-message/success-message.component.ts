import { injectable } from 'tsyringe';
import { i18nKeys } from '../../services/i18n/i18n-keys';
import { I18nService } from '../../services/i18n/i18n.service';
import { BaseComponent } from '../base-component/base-component';
import * as styles from './success-message.component.css';

@injectable()
export class SuccessMessageComponent extends BaseComponent {
    private message = document.createElement('span');

    constructor(
        protected i18n: I18nService
    ) {
        super(styles);

        this.message.classList.add(styles.message);

        this.rootElement.append(this.message);
        this.hide();
    }

    public async setMessage(message: i18nKeys, timeout: number = 3000) {
        this.i18n.follow(message, (value: string) => {
            this.message.textContent = value;
        });

        await this.show(timeout);
    }

    public clearMessage() {
        this.message.textContent = '';
    }

    async show(timeout: number) {
        new Promise((resolve) => {
            this.rootElement.style.display = 'block';
            setTimeout(() => {
                this.hide();
                resolve(true);
            }, timeout);
        });
    }

    hide() {
        this.rootElement.style.display = 'none';
        this.clearMessage();
    }
}