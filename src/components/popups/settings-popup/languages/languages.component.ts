import { singleton } from "tsyringe";
import { IconService } from "../../../../services/icon/icon.component";
import { BaseComponent } from "../../../base-component/base-component";
import { SelectComponent } from "../../../select/select.component";
import * as styles from './languages.component.css';
import { SettingsService } from "../../../../services/settings/settings.service";
import { SettingsNames } from "../../../../constants/settingsNames";
import { Language } from "../../../../types/Language";
import { I18nService } from "../../../../services/i18n/i18n.service";
import { i18nKeys } from "../../../../services/i18n/i18n-keys";

@singleton()
export class LanguagesComponent extends BaseComponent {
    private title = document.createElement('h2');
    private selectionWrapper = document.createElement('div');

    constructor(
        private sourceLanguageSelect: SelectComponent,
        private targetLanguageSelect: SelectComponent,
        private iconService: IconService,
        private settings: SettingsService,
        protected i18n: I18nService
    ) {
        super(styles);

        this.i18n.follow(i18nKeys.Languages, (text) => {
            this.title.textContent = text;
        });

        this.sourceLanguageSelect.setLabel('Select source language');
        this.targetLanguageSelect.setLabel('Select target language');

        this.selectionWrapper.append(
            this.sourceLanguageSelect.rootElement,
            this.iconService.init('arrow_forward'),
            this.targetLanguageSelect.rootElement,
        );

        this.selectionWrapper.classList.add(styles.selectionWrapper);

        this.rootElement.append(
            this.title,
            this.selectionWrapper
        );

        this.settings.subscribe(SettingsNames.LanguagesList, this.getLanguageOptions.bind(this));

        this.settings.subscribe(SettingsNames.SourceLanguage, this.sourceLanguageSelect.setValue.bind(this.sourceLanguageSelect));
        this.settings.subscribe(SettingsNames.TargetLanguage, this.targetLanguageSelect.setValue.bind(this.targetLanguageSelect));

        this.sourceLanguageSelect.onSelectChange.subscribe(this.onSourceLanguageChange.bind(this));
        this.targetLanguageSelect.onSelectChange.subscribe(this.onTargetLanguageChange.bind(this));

        this.sourceLanguageSelect.disable();
        this.targetLanguageSelect.disable();

        this.sourceLanguageSelect.addTooltip('Selecting other languages is not supported yet');
        this.targetLanguageSelect.addTooltip('Selecting other languages is not supported yet');
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