import { singleton } from "tsyringe";
import { BaseComponent } from "../../../base-component/base-component";
import * as styles from './pronunciation.component.css';
import { SwitchComponent } from "../../../switch/switch.component";
import { SliderComponent } from "../../../slider/slider.component";
import { SelectComponent } from "../../../select/select.component";
import { SettingsService } from "../../../../services/settings/settings.service";
import { SettingsNames } from "../../../../constants/settingsNames";
import { I18nService } from "../../../../services/i18n/i18n.service";
import { i18nKeys } from "../../../../services/i18n/i18n-keys";

@singleton()
export class PronunciationComponent extends BaseComponent {
    private title = document.createElement('h2');
    private controlsWrapper = document.createElement('div');
    private maxSpeed = "10";
    private minSpeed = "1";

    constructor(
        protected pronounceWithDoubleClick: SwitchComponent,
        protected pronounceSwitch: SwitchComponent,
        protected selectSpeedSlider: SliderComponent,
        protected selectVoice: SelectComponent,
        protected settings: SettingsService,
        protected i18n: I18nService
    ) {
        super(styles);

        this.i18n.follow(i18nKeys.Pronunciation, (text) => {
            this.title.textContent = text;
        });

        this.pronounceSwitch.setLabel('Pronounce by default');
        this.pronounceWithDoubleClick.setLabel('Pronounce with double click');

        this.settings.subscribe(SettingsNames.PronounceByDefault, this.pronounceSwitch.setValue.bind(this.pronounceSwitch));
        this.pronounceSwitch.onSwitch.subscribe(this.onPronounceDefaultChange.bind(this));

        this.settings.subscribe(SettingsNames.PronounceWithDoubleClick, this.pronounceWithDoubleClick.setValue.bind(this.pronounceWithDoubleClick));
        this.pronounceWithDoubleClick.onSwitch.subscribe(this.onPronounceWithDoubleClickChange.bind(this));

        this.selectSpeedSlider.setLabel('Select the speed')
        this.selectSpeedSlider.setMax(this.maxSpeed);
        this.selectSpeedSlider.setMin(this.minSpeed);

        this.settings.subscribe(SettingsNames.PronunciationSpeed, this.setSpeedValue.bind(this));

        this.selectVoice.setLabel('Select the voice');
        this.selectVoice.disable();
        this.selectVoice.rootElement.classList.add(styles.selectVoice);

        this.settings.subscribe(SettingsNames.Voices, (voices: string[]) => {
            this.selectVoice.setOptions(voices.map(voice => ({ value: voice, label: voice })));
            this.selectVoice.enable();
        });

        this.settings.subscribe(SettingsNames.Voice, this.setVoiceValue.bind(this));

        this.selectVoice.onSelectChange.subscribe(this.onVoiceChange.bind(this));

        this.controlsWrapper.classList.add(styles.controlsWrapper);

        this.controlsWrapper.append(
            this.pronounceSwitch.rootElement,
            this.pronounceWithDoubleClick.rootElement,
            this.selectSpeedSlider.rootElement,
            this.selectVoice.rootElement
        );

        this.rootElement.append(
            this.title,
            this.controlsWrapper
        );
    }

    private onVoiceChange(voice: string) {
        this.settings.set(SettingsNames.Voice, voice);
    }

    private onPronounceWithDoubleClickChange(value: boolean) {
        this.settings.set(SettingsNames.PronounceWithDoubleClick, value);
    }

    private onPronounceDefaultChange(value: boolean) {
        this.settings.set(SettingsNames.PronounceByDefault, value);
    }

    private setSpeedValue(speed: string) {
        this.selectSpeedSlider.setValue(speed);
    }

    private setVoiceValue(voice: string) {
        this.selectVoice.setValue(voice || this.settings.get(SettingsNames.Voices)[0]);
    }
}