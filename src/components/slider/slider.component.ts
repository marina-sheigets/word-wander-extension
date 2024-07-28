import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './slider.component.css';

@injectable()
export class SliderComponent extends BaseComponent {
    private input = document.createElement('input');
    private label = document.createElement('label');
    constructor() {
        super(styles);

        this.input.type = 'range';
        this.input.addEventListener('change', () => {
            console.log("slider is changing");
        })

        this.rootElement.append(
            this.label,
            this.input
        );
    }

    setLabel(label: string) {
        this.label.textContent = label;
    }
    setMax(value: string) {
        this.input.max = value;
    }

    setMin(value: string) {
        this.input.min = value;
    }



}