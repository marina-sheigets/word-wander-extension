import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './slider.component.css';
import { SettingsService } from "../../services/settings/settings.service";
import { SettingsNames } from "../../constants/settingsNames";

@injectable()
export class SliderComponent extends BaseComponent {
    private input = document.createElement('input');
    private label = document.createElement('label');

    constructor(
        protected settings: SettingsService
    ) {
        super(styles);

        this.input.type = 'range';
        this.input.addEventListener('change', () => {
            console.log("slider is changing");
        })

        this.rootElement.append(
            this.label,
            this.input
        );

        this.input.addEventListener('change', this.onSliderChange.bind(this));
    }

    private onSliderChange() {
        this.settings.set(SettingsNames.PronunciationSpeed, this.input.value);
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

    setValue(value: string) {
        this.input.value = value;
    }
}