import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './input.component.css';
import { Informer } from "../../services/informer/informer.service";
import { IconService } from "../../services/icon/icon.component";
import { I18nService } from "../../services/i18n/i18n.service";
import { i18nKeys } from "../../services/i18n/i18n-keys";

@injectable()
export class InputComponent extends BaseComponent {
    private label = document.createElement('label');
    private labelText = document.createElement('span');
    public input = document.createElement('input');
    onChange = new Informer<string>();

    constructor(
        protected iconService: IconService,
        protected i18nService: I18nService,
    ) {
        super(styles);

        this.input.addEventListener('keydown', this.onInputChange.bind(this));

        this.label.append(
            this.labelText,
            this.input,
        );

        this.rootElement.append(
            this.label,
        );
    }

    private onInputChange(e: KeyboardEvent) {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        e.stopPropagation();

        this.onChange.inform(this.input.value);
    }

    setLabel(key: string) {
        this.i18nService.follow(key as i18nKeys, (text) => {
            this.labelText.textContent = text;
        });
    }

    setInputSettings(type: string, placeholder: string) {
        this.input.type = type;
        this.input.placeholder = placeholder;
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
}