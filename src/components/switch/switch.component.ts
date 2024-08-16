import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './switch.component.css';
import { Informer } from "../../services/informer/informer.service";
import { I18nService } from "../../services/i18n/i18n.service";
import { i18nKeys } from "../../services/i18n/i18n-keys";

@injectable()
export class SwitchComponent extends BaseComponent {
    private labelText = document.createElement('span');
    private label = document.createElement('label');
    private input = document.createElement('input');
    private span = document.createElement('span');
    public onSwitch = new Informer<boolean>();

    constructor(
        protected i18n: I18nService,
    ) {
        super(styles);

        this.input.type = 'checkbox';

        this.label.classList.add(styles.switch);
        this.span.classList.add(styles.slider, styles.round);

        this.label.append(
            this.input,
            this.span
        );

        this.rootElement.append(this.labelText, this.label);

        this.input.addEventListener('change', this.switchHandler.bind(this));

    }

    setValue(value: boolean) {
        this.input.checked = value;
    }

    private switchHandler() {
        this.onSwitch.inform(this.input.checked);
    }

    setLabel(key: i18nKeys) {
        this.i18n.follow(key, (text) => {
            this.labelText.textContent = text;
        });
    }
}