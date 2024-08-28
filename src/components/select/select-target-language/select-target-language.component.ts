import { injectable } from "tsyringe";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { SettingsService } from "../../../services/settings/settings.service";
import { SelectComponent } from "../select.component";
import { Option } from "../../../types/Option";

@injectable()
export class SelectTargetLanguageComponent extends SelectComponent {

    dictionaryLanguages: Option[] = [
        { value: 'en', label: 'English' }
    ];

    constructor(
        protected i18nService: I18nService,
        protected settings: SettingsService,
    ) {
        super(i18nService);

        this.setOptions(this.dictionaryLanguages);
        this.setValue("en");
        this.disable();
        this.addTooltip(i18nKeys.NotSupportedLanguage);
    }
}