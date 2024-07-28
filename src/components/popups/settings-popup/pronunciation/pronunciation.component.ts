import { singleton } from "tsyringe";
import { BaseComponent } from "../../../base-component/base-component";
import * as styles from './pronunciation.component.css';
import { SwitchComponent } from "../../../switch/switch.component";
import { SliderComponent } from "../../../slider/slider.component";
import { SelectComponent } from "../../../select/select.component";

@singleton()
export class PronunciationComponent extends BaseComponent {
    private title = document.createElement('h2');
    private controlsWrapper = document.createElement('div');

    constructor(
        protected pronounceSwitch: SwitchComponent,
        protected selectSpeedSlider: SliderComponent,
        protected selectVoice: SelectComponent,
    ) {
        super(styles);

        this.title.textContent = "Pronunciation";

        this.pronounceSwitch.setLabel('Pronounce by default');

        this.selectSpeedSlider.setLabel('Select th speed')
        this.selectSpeedSlider.setMax("5");
        this.selectSpeedSlider.setMin("1");

        this.controlsWrapper.classList.add(styles.controlsWrapper);

        this.controlsWrapper.append(
            this.pronounceSwitch.rootElement,
            this.selectSpeedSlider.rootElement,
            this.selectVoice.rootElement
        );

        this.rootElement.append(
            this.title,
            this.controlsWrapper
        );
    }
}