import { singleton } from "tsyringe";
import { BaseComponent } from "../../../../base-component/base-component";
import * as styles from "./trainings-dictionary.component.css";
import { FindWordInputComponent } from "../../../../input/find-word-input/find-word-input.component";
import { DictionaryTableComponent } from "../../../../dictionary-table/dictionary-table.component";
import { AddCustomTranslationButton } from "../../../../button/add-custom-translation/add-custom-translation.button";
import { SelectComponent } from "../../../../select/select.component";
import { dictionaryViewOptions } from "../../../../../constants/dictionaryViewOptions";
import { i18nKeys } from "../../../../../services/i18n/i18n-keys";

@singleton()
export class TrainingsDictionaryComponent extends BaseComponent {
    private selectedView: i18nKeys.WordList | i18nKeys.Collections = i18nKeys.WordList;

    private toolsContainer = document.createElement('div');
    private dictionaryContent = document.createElement('div');

    constructor(
        protected findWordInputComponent: FindWordInputComponent,
        protected viewSelect: SelectComponent,
        protected addCustomTranslationButton: AddCustomTranslationButton,
        protected dictionaryTable: DictionaryTableComponent,

    ) {
        super(styles);

        this.viewSelect.setOptions(dictionaryViewOptions);

        this.viewSelect.setValue(this.selectedView);
        this.changeDictionaryView(this.selectedView);

        this.viewSelect.onSelectChange.subscribe(this.changeDictionaryView.bind(this));

        this.dictionaryContent.classList.add(styles.dictionaryContent);
        this.toolsContainer.classList.add(styles.toolsContainer);

        this.toolsContainer.append(
            this.findWordInputComponent.rootElement,
            this.viewSelect.rootElement,
            this.addCustomTranslationButton.rootElement,
        );

        this.rootElement.append(
            this.toolsContainer,
            this.dictionaryContent
        );

        this.findWordInputComponent.onChange.subscribe(() => {
            //this.dictionaryTable.filterWords(value);
        });
    }

    private changeDictionaryView(value: i18nKeys.WordList | i18nKeys.Collections) {
        this.dictionaryContent.innerHTML = "";
        this.selectedView = value;

        this.setDictionaryContent();
    }

    private setDictionaryContent() {
        if (this.selectedView === i18nKeys.WordList) {
            this.setWordListView()
        } else {
            this.setCollectionsView()
        }
    }

    private setWordListView() {
        this.dictionaryContent.append(this.dictionaryTable.rootElement);
    }

    private setCollectionsView() {
    }
}