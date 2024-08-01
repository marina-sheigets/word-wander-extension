import { singleton } from "tsyringe";
import { IconService } from "../../../../services/icon/icon.component";
import { BaseComponent } from "../../../base-component/base-component";
import { SelectComponent } from "../../../select/select.component";
import * as styles from './languages.component.css';
import { SettingsService } from "../../../../services/settings/settings.service";
import { SettingsNames } from "../../../../constants/settingsNames";
import { Language } from "../../../../types/Language";

@singleton()
export class LanguagesComponent extends BaseComponent {
    private title = document.createElement('h2');
    private selectionWrapper = document.createElement('div');

    constructor(
        private sourceLanguageSelect: SelectComponent,
        private targetLanguageSelect: SelectComponent,
        private iconService: IconService,
        private settings: SettingsService
    ) {
        super(styles);

        this.title.textContent = "Languages";

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

        this.sourceLanguageSelect.setOptions(this.getLanguageOptions());
        this.sourceLanguageSelect.setValue(this.settings.get(SettingsNames.SourceLanguage));

        this.targetLanguageSelect.setOptions(this.getLanguageOptions());
        this.targetLanguageSelect.setValue(this.settings.get(SettingsNames.TargetLanguage));

        this.sourceLanguageSelect.onSelectChange.subscribe(this.onSourceLanguageChange.bind(this));
        this.targetLanguageSelect.onSelectChange.subscribe(this.onTargetLanguageChange.bind(this));

    }

    private onTargetLanguageChange(value: string) {
        this.settings.set(SettingsNames.TargetLanguage, value);
    }

    private onSourceLanguageChange(value: string) {
        this.settings.set(SettingsNames.SourceLanguage, value);
    }

    private getLanguageOptions(): Language[] {
        return this.settings.get(SettingsNames.LanguagesList);
    }


}