import { injectable } from 'tsyringe';
import { i18nKeys } from '../../services/i18n/i18n-keys';
import { I18nService } from '../../services/i18n/i18n.service';
import { BaseComponent } from '../base-component/base-component';
import * as styles from './amount-words-chip.component.css';

@injectable()
export class AmountWordsChipComponent extends BaseComponent {
    private amount = 0;

    constructor(
        protected i18n: I18nService,
    ) {
        super(styles);
    }

    setAmount(amount: number) {
        this.amount = amount;

        this.i18n.follow(i18nKeys.AmountWordsChip, (value: string) => {
            this.rootElement.textContent = `${value}: ${amount}`;
        });

        if (amount === 0) {
            this.rootElement.classList.remove(styles.active);
            this.rootElement.classList.add(styles.inactive);
        } else {
            this.rootElement.classList.remove(styles.inactive);
            this.rootElement.classList.add(styles.active);
        }
    }

    getAmount() {
        return this.amount;
    }
}