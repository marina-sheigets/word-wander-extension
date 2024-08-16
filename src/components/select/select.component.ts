import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './select.component.css';
import { Informer } from "../../services/informer/informer.service";
import { I18nService } from "../../services/i18n/i18n.service";
import { i18nKeys } from "../../services/i18n/i18n-keys";

interface Option {
    value: string,
    label: string,
}
@injectable()
export class SelectComponent extends BaseComponent {
    private selectInput = document.createElement('select');
    private label = document.createElement('label');
    public onSelectChange = new Informer();

    constructor(
        protected i18n: I18nService,
    ) {
        super(styles);

        this.label.classList.add(styles.label);

        this.rootElement.append(
            this.label,
            this.selectInput
        );

        this.selectInput.addEventListener('change', this.onChange.bind(this));

    }

    setLabel(key: i18nKeys) {
        this.i18n.follow(key, (text) => {
            this.label.textContent = text;
        });
    }

    setOptions(options: Option[]) {
        options.forEach((item) => {
            const option = document.createElement('option');
            option.value = item.value;
            option.label = item.label;

            this.selectInput.append(option);
        });
    }

    setValue(value: string) {
        this.selectInput.value = value;
    }

    onChange(e: Event) {
        this.onSelectChange.inform((e.target as HTMLSelectElement).value);
    }

    disable() {
        this.selectInput.disabled = true;
        this.selectInput.classList.add(styles.disabled);
    }

    enable() {
        this.selectInput.disabled = false;
        this.selectInput.classList.remove(styles.disabled);
    }

    addTooltip(key: i18nKeys) {
        this.i18n.follow(key, (tooltip) => {
            this.rootElement.title = tooltip;
        });
    }
}