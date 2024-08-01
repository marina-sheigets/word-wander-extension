import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './select.component.css';
import { Informer } from "../../services/informer/informer.service";

interface Option {
    value: string,
    label: string,
}
@injectable()
export class SelectComponent extends BaseComponent {
    private selectInput = document.createElement('select');
    private label = document.createElement('label');
    public onSelectChange = new Informer();

    constructor() {
        super(styles);

        this.label.classList.add(styles.label);

        this.rootElement.append(
            this.label,
            this.selectInput
        );

        this.selectInput.addEventListener('change', this.onChange.bind(this));

    }

    setLabel(label: string) {
        this.label.textContent = label;
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

    addTooltip(text: string) {
        this.rootElement.title = text;
    }
}