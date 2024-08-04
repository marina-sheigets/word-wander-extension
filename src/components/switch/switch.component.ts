import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './switch.component.css';
import { Informer } from "../../services/informer/informer.service";

@injectable()
export class SwitchComponent extends BaseComponent {
    private label = document.createElement('label');
    private input = document.createElement('input');
    private span = document.createElement('span');
    public onSwitch = new Informer<boolean>();

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

        this.input.addEventListener('change', this.switchHandler.bind(this));

    }

    setValue(value: boolean) {
        this.input.checked = value;
    }

    private switchHandler() {
        this.onSwitch.inform(this.input.checked);
    }

    setLabel(label: string) {
        this.rootElement.prepend(label);
    }
}