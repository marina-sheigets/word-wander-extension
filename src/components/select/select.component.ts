import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './select.component.css';

interface Option {
    value: string,
    label: string,
}
@injectable()
export class SelectComponent extends BaseComponent {
    private selectInput = document.createElement('select');
    private label = document.createElement('label');

    constructor() {
        super(styles);

        this.label.classList.add(styles.label);

        this.rootElement.append(
            this.label,
            this.selectInput
        );

        this.selectInput.addEventListener('change', (e) => {
            console.log(e)
        })

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
}