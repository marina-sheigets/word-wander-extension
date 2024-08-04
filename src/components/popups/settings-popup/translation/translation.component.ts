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
        protected doubleClickSwitch: SwitchComponent,
        protected synonymsSwitch: SwitchComponent,
        protected usageSwitch: SwitchComponent,
        protected settings: SettingsService
    ) {
        super(styles);

        this.title.textContent = 'Translation';

        this.doubleClickSwitch.setLabel('Translate with double click');
        this.synonymsSwitch.setLabel('Show synonyms');
        this.usageSwitch.setLabel('Show examples of usage');

        this.doubleClickSwitch.setValue(this.settings.get(SettingsNames.TranslateWithDoubleClick));
        this.synonymsSwitch.setValue(this.settings.get(SettingsNames.ShowSynonyms));
        this.usageSwitch.setValue(this.settings.get(SettingsNames.ShowExamples));

        this.switchWrapper.classList.add(styles.switchWrapper);

        this.switchWrapper.append(
            this.doubleClickSwitch.rootElement,
            this.synonymsSwitch.rootElement,
            this.usageSwitch.rootElement
        );

        this.rootElement.append(
            this.title,
            this.switchWrapper
        );

        this.doubleClickSwitch.onSwitch.subscribe(this.onDoubleClickSwitch.bind(this));
        this.synonymsSwitch.onSwitch.subscribe(this.onSynonymsSwitch.bind(this));
        this.usageSwitch.onSwitch.subscribe(this.onUsageSwitch.bind(this));
    }

    private onDoubleClickSwitch(value: boolean) {
        this.settings.set(SettingsNames.TranslateWithDoubleClick, value);
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