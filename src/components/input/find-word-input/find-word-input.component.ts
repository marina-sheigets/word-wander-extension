import { singleton } from "tsyringe";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { InputComponent } from "../input.component";
import { SettingsService } from "../../../services/settings/settings.service";
import { SettingsNames } from "../../../constants/settingsNames";

@singleton()
export class FindWordInputComponent extends InputComponent {
    constructor(
        protected i18nService: I18nService,
        protected settingsService: SettingsService,
    ) {
        super(i18nService);

        this.setInputSettings('text', i18nKeys.EnterWord);

        this.settingsService.subscribe(SettingsNames.User, () => {
            this.clear();
        });
    }
}