import { singleton } from "tsyringe";
import * as styles from './profile-settings.component.css';
import { SelectComponent } from "../../../select/select.component";
import { InterfaceLanguages } from "../../../../constants/interfaceLanguages";
import { SettingsService } from "../../../../services/settings/settings.service";
import { SettingsNames } from "../../../../constants/settingsNames";
import { I18nService } from "../../../../services/i18n/i18n.service";
import { i18nKeys } from "../../../../services/i18n/i18n-keys";
import { TabContent } from "../../../tab-content/tab-content.component";

@singleton()
export class ProfileSettingsComponent extends TabContent {
    constructor(
        protected interfaceLanguageSelector: SelectComponent,
        protected settings: SettingsService,
        protected i18n: I18nService
    ) {
        super(i18n);

        this.applyRootStyle(styles);

        this.setTitle(i18nKeys.Profile);

        this.interfaceLanguageSelector.setLabel(i18nKeys.InterfaceLanguage);
        this.interfaceLanguageSelector.setOptions(InterfaceLanguages);
        this.interfaceLanguageSelector.onSelectChange.subscribe(this.onInterfaceLanguageChange.bind(this));
        this.settings.subscribe(SettingsNames.InterfaceLanguage, this.interfaceLanguageSelector.setValue.bind(this.interfaceLanguageSelector));

        this.setContent(
            this.interfaceLanguageSelector.rootElement
        );
    }

    private onInterfaceLanguageChange(value: string) {
        this.settings.set(SettingsNames.InterfaceLanguage, value);
    }

}