import { singleton } from "tsyringe";
import { BaseComponent } from "../../../base-component/base-component";
import * as styles from './profile-settings.component.css';
import { SelectComponent } from "../../../select/select.component";
import { InterfaceLanguages } from "../../../../constants/interfaceLanguages";
import { SettingsService } from "../../../../services/settings/settings.service";
import { SettingsNames } from "../../../../constants/settingsNames";

@singleton()
export class ProfileSettingsComponent extends BaseComponent {
    private title = document.createElement('h2');

    constructor(
        protected interfaceLanguageSelector: SelectComponent,
        protected settings: SettingsService
    ) {
        super();

        this.applyRootStyle(styles);

        this.title.textContent = "Profile";
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