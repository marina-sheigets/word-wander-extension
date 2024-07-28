import { singleton } from "tsyringe";
import { IconService } from "../../../../services/icon/icon.component";
import { BaseComponent } from "../../../base-component/base-component";
import { SelectComponent } from "../../../select/select.component";
import * as styles from './languages.component.css';

@singleton()
export class LanguagesComponent extends BaseComponent {
    private title = document.createElement('h2');
    private selectionWrapper = document.createElement('div');

    constructor(
        private sourceLanguageSelect: SelectComponent,
        private targetLanguageSelect: SelectComponent,
        private iconService: IconService
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
    }
}