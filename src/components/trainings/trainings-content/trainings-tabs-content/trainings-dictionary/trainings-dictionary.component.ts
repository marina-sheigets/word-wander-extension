import { singleton } from "tsyringe";
import { BaseComponent } from "../../../../base-component/base-component";
import * as styles from "./trainings-dictionary.component.css";
import { FindWordInputComponent } from "../../../../input/find-word-input/find-word-input.component";
import { ButtonComponent } from "../../../../button/button.component";
import { i18nKeys } from "../../../../../services/i18n/i18n-keys";
import { DictionaryTableComponent } from "../../../../dictionary-table/dictionary-table.component";

@singleton()
export class TrainingsDictionaryComponent extends BaseComponent {
    private toolsContainer = document.createElement('div');

    constructor(
        protected findWordInputComponent: FindWordInputComponent,
        protected addCustomTranslationButton: ButtonComponent,
        protected dictionaryTable: DictionaryTableComponent,
    ) {
        super(styles);

        this.addCustomTranslationButton.addButtonName(i18nKeys.AddCustomTranslation);

        this.toolsContainer.classList.add(styles.toolsContainer);

        this.toolsContainer.append(
            this.findWordInputComponent.rootElement,
            this.addCustomTranslationButton.rootElement,
        );

        this.rootElement.append(
            this.toolsContainer,
            this.dictionaryTable.rootElement,
        );

        this.findWordInputComponent.onChange.subscribe((value) => {
            this.dictionaryTable.filterWords(value);
        });
    }
}