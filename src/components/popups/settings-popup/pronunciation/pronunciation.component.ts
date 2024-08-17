import { singleton } from "tsyringe";
import * as styles from './pronunciation.component.css';
import { SwitchComponent } from "../../../switch/switch.component";
import { SliderComponent } from "../../../slider/slider.component";
import { SelectComponent } from "../../../select/select.component";
import { SettingsService } from "../../../../services/settings/settings.service";
import { SettingsNames } from "../../../../constants/settingsNames";
import { I18nService } from "../../../../services/i18n/i18n.service";
import { i18nKeys } from "../../../../services/i18n/i18n-keys";
import { TabContent } from "../../../tab-content/tab-content.component";

@singleton()
export class PronunciationComponent extends TabContent {
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

        this.setTitle(i18nKeys.Pronunciation);

        this.pronounceSwitch.setLabel(i18nKeys.PronounceByDefault);
        this.pronounceWithDoubleClick.setLabel(i18nKeys.PronounceWithDoubleClick);

        this.settings.subscribe(SettingsNames.PronounceByDefault, this.pronounceSwitch.setValue.bind(this.pronounceSwitch));
        this.pronounceSwitch.onSwitch.subscribe(this.onPronounceDefaultChange.bind(this));

        this.settings.subscribe(SettingsNames.PronounceWithDoubleClick, this.pronounceWithDoubleClick.setValue.bind(this.pronounceWithDoubleClick));
        this.pronounceWithDoubleClick.onSwitch.subscribe(this.onPronounceWithDoubleClickChange.bind(this));

        this.selectSpeedSlider.setLabel(i18nKeys.SelectSpeed);
        this.selectSpeedSlider.setMax(this.maxSpeed);
        this.selectSpeedSlider.setMin(this.minSpeed);

        this.settings.subscribe(SettingsNames.PronunciationSpeed, this.setSpeedValue.bind(this));

        this.selectVoice.setLabel(i18nKeys.SelectVoice);
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

        this.setContent(this.controlsWrapper);
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