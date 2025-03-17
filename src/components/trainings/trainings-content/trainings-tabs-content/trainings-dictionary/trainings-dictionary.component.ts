import { singleton } from "tsyringe";
import { BaseComponent } from "../../../../base-component/base-component";
import * as styles from "./trainings-dictionary.component.css";
import { FindWordInputComponent } from "../../../../input/find-word-input/find-word-input.component";
import { DictionaryTableComponent } from "../../../../dictionary-table/dictionary-table.component";
import { AddCustomTranslationButton } from "../../../../button/add-custom-translation/add-custom-translation.button";

@singleton()
export class TrainingsDictionaryComponent extends BaseComponent {
    private toolsContainer = document.createElement('div');

    constructor(
        protected findWordInputComponent: FindWordInputComponent,
        protected addCustomTranslationButton: AddCustomTranslationButton,
        protected dictionaryTable: DictionaryTableComponent,
    ) {
        super(styles);


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