import { singleton } from "tsyringe";
import { BaseComponent } from "../../../base-component/base-component";
import * as styles from './profile-settings.component.css';
import { SelectComponent } from "../../../select/select.component";
import { InterfaceLanguages } from "../../../../constants/interfaceLanguages";
import { SettingsService } from "../../../../services/settings/settings.service";
import { SettingsNames } from "../../../../constants/settingsNames";
import { I18nService } from "../../../../services/i18n/i18n.service";
import { i18nKeys } from "../../../../services/i18n/i18n-keys";

@singleton()
export class ProfileSettingsComponent extends BaseComponent {
    private title = document.createElement('h2');

    constructor(
        protected interfaceLanguageSelector: SelectComponent,
        protected settings: SettingsService,
        protected i18n: I18nService
    ) {
        super();

        this.applyRootStyle(styles);

        this.i18n.follow(i18nKeys.Profile, (text) => {
            this.title.textContent = text;
        })

        this.interfaceLanguageSelector.setLabel('Interface language');
        this.interfaceLanguageSelector.setOptions(InterfaceLanguages);
        this.interfaceLanguageSelector.onSelectChange.subscribe(this.onInterfaceLanguageChange.bind(this));
        this.settings.subscribe(SettingsNames.InterfaceLanguage, this.interfaceLanguageSelector.setValue.bind(this.interfaceLanguageSelector));

        this.rootElement.append(
            this.title,
            this.interfaceLanguageSelector.rootElement
        );
    }

    private onInterfaceLanguageChange(value: string) {
        this.settings.set(SettingsNames.InterfaceLanguage, value);
    }

}