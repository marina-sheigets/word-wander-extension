import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './switch.component.css';

@injectable()
export class SwitchComponent extends BaseComponent {
    private label = document.createElement('label');
    private input = document.createElement('input');
    private span = document.createElement('span');

    constructor() {
        super(styles);

        this.input.type = 'checkbox';

        this.label.classList.add(styles.switch);
        this.span.classList.add(styles.slider, styles.round);

        this.label.append(
            this.input,
            this.span
        );

        this.rootElement.append(this.label);
    }

    setLabel(label: string) {
        this.rootElement.prepend(label);
    }
}