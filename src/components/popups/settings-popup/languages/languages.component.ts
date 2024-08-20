import { singleton } from "tsyringe";
import { SelectComponent } from "../../../select/select.component";
import * as styles from './languages.component.css';
import { SettingsService } from "../../../../services/settings/settings.service";
import { SettingsNames } from "../../../../constants/settingsNames";
import { Language } from "../../../../types/Language";
import { I18nService } from "../../../../services/i18n/i18n.service";
import { i18nKeys } from "../../../../services/i18n/i18n-keys";
import { TabContent } from "../../../tab-content/tab-content.component";
import { IconComponent } from "../../../icon/icon.component";

@singleton()
export class LanguagesComponent extends TabContent {
    private selectionWrapper = document.createElement('div');

    constructor(
        private sourceLanguageSelect: SelectComponent,
        private targetLanguageSelect: SelectComponent,
        private icon: IconComponent,
        private settings: SettingsService,
        protected i18n: I18nService
    ) {
        super(styles);

        this.setTitle(i18nKeys.Languages);

        this.sourceLanguageSelect.setLabel(i18nKeys.SelectSourceLanguage);
        this.targetLanguageSelect.setLabel(i18nKeys.SelectTargetLanguage);

        this.icon.setIcon('arrow_forward');

        this.selectionWrapper.append(
            this.sourceLanguageSelect.rootElement,
            this.icon.rootElement,
            this.targetLanguageSelect.rootElement,
        );

        this.selectionWrapper.classList.add(styles.selectionWrapper);

        this.setContent(
            this.selectionWrapper
        )
        this.settings.subscribe(SettingsNames.LanguagesList, this.getLanguageOptions.bind(this));

        this.settings.subscribe(SettingsNames.SourceLanguage, this.sourceLanguageSelect.setValue.bind(this.sourceLanguageSelect));
        this.settings.subscribe(SettingsNames.TargetLanguage, this.targetLanguageSelect.setValue.bind(this.targetLanguageSelect));

        this.sourceLanguageSelect.onSelectChange.subscribe(this.onSourceLanguageChange.bind(this));
        this.targetLanguageSelect.onSelectChange.subscribe(this.onTargetLanguageChange.bind(this));

        this.sourceLanguageSelect.disable();
        this.targetLanguageSelect.disable();

        this.sourceLanguageSelect.addTooltip(i18nKeys.NotSupportedLanguage);
        this.targetLanguageSelect.addTooltip(i18nKeys.NotSupportedLanguage);
    }

    private onTargetLanguageChange(value: string) {
        this.settings.set(SettingsNames.TargetLanguage, value);
    }

    private onSourceLanguageChange(value: string) {
        this.settings.set(SettingsNames.SourceLanguage, value);
    }

    private getLanguageOptions(settings: Language[]): void {
        this.targetLanguageSelect.setOptions(settings);
        this.sourceLanguageSelect.setOptions(settings);

        this.targetLanguageSelect.setValue(settings[1].value);
        this.sourceLanguageSelect.setValue(settings[0].value);
    }
}