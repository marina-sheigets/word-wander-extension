import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './input.component.css';
import { Informer } from "../../services/informer/informer.service";
import { I18nService } from "../../services/i18n/i18n.service";
import { i18nKeys } from "../../services/i18n/i18n-keys";

@injectable()
export class InputComponent extends BaseComponent {
    private label = document.createElement('label');
    private labelText = document.createElement('span');
    public input = document.createElement('input');
    onChange = new Informer<string>();

    constructor(
        protected i18nService: I18nService,
    ) {
        super(styles);

        this.input.addEventListener('input', this.onInputChange.bind(this));

        this.labelText.classList.add(styles.hidden);

        this.label.append(
            this.labelText,
            this.input,
        );

        this.rootElement.append(
            this.label,
        );
    }

    private onInputChange(e: KeyboardEvent) {
        e.preventDefault();
        e.stopPropagation();

        this.onChange.inform(this.input.value);
    }

    setLabel(key: string) {
        this.labelText.classList.remove(styles.hidden);

        this.i18nService.follow(key as i18nKeys, (text) => {
            this.labelText.textContent = text;
        });
    }

    setInputSettings(type: string, placeholder: i18nKeys) {
        this.input.type = type;
        this.i18nService.follow(placeholder, (text) => {
            this.input.placeholder = text;
        });
    }

    setDisabled() {
        this.input.disabled = true;
    }

    setEnabled() {
        this.input.disabled = false;
    }

    clear() {
        this.input.value = "";
    }

    getValue() {
        return this.input.value;
    }
}