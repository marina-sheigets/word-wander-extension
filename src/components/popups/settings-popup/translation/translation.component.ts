import { singleton } from "tsyringe";
import { BaseComponent } from "../../../base-component/base-component";
import { SwitchComponent } from "../../../switch/switch.component";
import * as styles from './translation.component.css';
import { SettingsService } from "../../../../services/settings/settings.service";
import { SettingsNames } from "../../../../constants/settingsNames";

@singleton()
export class TranslationComponent extends BaseComponent {
    private title = document.createElement('h2');
    private switchWrapper = document.createElement('div');
    constructor(
        protected synonymsSwitch: SwitchComponent,
        protected usageSwitch: SwitchComponent,
        protected settings: SettingsService
    ) {
        super(styles);

        this.title.textContent = 'Translation';

        this.synonymsSwitch.setLabel('Show synonyms');
        this.usageSwitch.setLabel('Show examples of usage');

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