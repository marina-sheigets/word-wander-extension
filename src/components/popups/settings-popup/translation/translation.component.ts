import { singleton } from "tsyringe";
import { BaseComponent } from "../../../base-component/base-component";
import { SwitchComponent } from "../../../switch/switch.component";
import * as styles from './translation.component.css';
import { SettingsService } from "../../../../services/settings/settings.service";
import { SettingsNames } from "../../../../constants/settingsNames";
import { I18nService } from "../../../../services/i18n/i18n.service";
import { i18nKeys } from "../../../../services/i18n/i18n-keys";

@singleton()
export class TranslationComponent extends BaseComponent {
    private title = document.createElement('h2');
    private switchWrapper = document.createElement('div');
    constructor(
        protected synonymsSwitch: SwitchComponent,
        protected usageSwitch: SwitchComponent,
        protected settings: SettingsService,
        protected i18n: I18nService
    ) {
        super(styles);

        this.i18n.follow(i18nKeys.Translation, (text) => {
            this.title.textContent = text;
        });

        this.synonymsSwitch.setLabel(i18nKeys.ShowSynonyms);
        this.usageSwitch.setLabel(i18nKeys.ShowExamples);

        this.settings.subscribe(SettingsNames.ShowSynonyms, this.synonymsSwitch.setValue.bind(this.synonymsSwitch));
        this.settings.subscribe(SettingsNames.ShowExamples, this.usageSwitch.setValue.bind(this.usageSwitch));

        this.switchWrapper.classList.add(styles.switchWrapper);

        this.switchWrapper.append(
            this.synonymsSwitch.rootElement,
            this.usageSwitch.rootElement
        );

        this.rootElement.append(
            this.title,
            this.switchWrapper
        );

        this.synonymsSwitch.onSwitch.subscribe(this.onSynonymsSwitch.bind(this));
        this.usageSwitch.onSwitch.subscribe(this.onUsageSwitch.bind(this));
    }

    private onSynonymsSwitch(value: boolean) {
        this.settings.set(SettingsNames.ShowSynonyms, value);
    }

    private onUsageSwitch(value: boolean) {
        this.settings.set(SettingsNames.ShowExamples, value);
    }

    setTitle(title: string) {
        this.title.textContent = title;
    }
}