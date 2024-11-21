import { singleton } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import { I18nService } from "../../services/i18n/i18n.service";
import { i18nKeys } from "../../services/i18n/i18n-keys";
import * as styles from "./dictionary-table.component.css";
import { ButtonComponent } from "../button/button.component";
import { TableComponent } from "./table/table.component";
import { DictionaryService } from "../../services/dictionary/dictionary.service";
import { DictionaryTableItem } from "../../types/DictionaryTableItem";

@singleton()
export class DictionaryTableComponent extends BaseComponent {
    private amountWordsLabel = document.createElement('div');
    private tableHeaderTools = document.createElement('div');
    private wordsSelectedLabel = document.createElement('div');

    constructor(
        protected i18n: I18nService,
        protected selectAllButton: ButtonComponent,
        protected unselectAllButton: ButtonComponent,
        protected sendOnTrainingButton: ButtonComponent,
        protected tableComponent: TableComponent,
        protected dictionaryService: DictionaryService
    ) {
        super();

        this.selectAllButton.addButtonName(i18nKeys.SelectAll);
        this.selectAllButton.rootElement.classList.add(styles.selectAllButton);
        this.selectAllButton.onClick.subscribe(() => {
            this.tableComponent.toggleSelectAllWords(true);
            this.toggleHideDeleteWordButtons(true);
        });

        this.sendOnTrainingButton.addButtonName(i18nKeys.SendOnTraining);
        this.sendOnTrainingButton.hide();

        this.unselectAllButton.addButtonName(i18nKeys.UnselectAll);
        this.unselectAllButton.rootElement.classList.add(styles.selectAllButton);
        this.unselectAllButton.onClick.subscribe(() => {
            this.tableComponent.toggleSelectAllWords(false);
            this.toggleHideDeleteWordButtons(false);
        });
        this.unselectAllButton.hide();

        this.amountWordsLabel.classList.add(styles.amountWords);
        this.tableHeaderTools.classList.add(styles.tableHeaderTools);

        this.wordsSelectedLabel.classList.add(styles.wordsSelectedLabel);

        this.dictionaryService.onDataChanged.subscribe(this.changeWordsInDictionaryLabel.bind(this));

        this.tableHeaderTools.append(
            this.selectAllButton.rootElement,
            this.unselectAllButton.rootElement,
            this.sendOnTrainingButton.rootElement,
            this.wordsSelectedLabel
        );

        this.rootElement.append(
            this.amountWordsLabel,
            this.tableHeaderTools,
            this.tableComponent.rootElement
        );

        this.tableComponent.onSelectedChange.subscribe(this.changeWordsSelectedLabel.bind(this));
    }

    private changeWordsSelectedLabel() {
        const selectedWords = this.tableComponent.getTableData().filter(item => item.selected);

        this.toggleSelectAllWordsButtons(selectedWords.length);

        if (selectedWords.length) {
            this.sendOnTrainingButton.show();
            this.toggleHideDeleteWordButtons(true);

            if (selectedWords.length === 1) {
                this.i18n.follow(i18nKeys.OneWordSelected, (value) => {
                    this.wordsSelectedLabel.textContent = value;
                });
            } else {
                this.i18n.follow(i18nKeys.ManyWordsSelected, (value) => {
                    this.wordsSelectedLabel.textContent = selectedWords.length + value;
                });
            }
        } else {
            this.toggleHideDeleteWordButtons(false);
            this.sendOnTrainingButton.hide();
            this.wordsSelectedLabel.textContent = "";
        }
    }

    private changeWordsInDictionaryLabel(data: DictionaryTableItem[]) {
        this.i18n.follow(i18nKeys.AmountWords, (value) => {
            this.amountWordsLabel.textContent = data.length + value;
        });

        if (!data.length) {
            this.selectAllButton.hide();
        }
    }

    protected toggleSelectAllWordsButtons(amountOfSelectedWords: number) {
        if (amountOfSelectedWords === this.tableComponent.getTableData().length) {
            this.selectAllButton.hide();
            this.unselectAllButton.show();
        } else {
            this.selectAllButton.show();
            this.unselectAllButton.hide();
        }
    }

    private toggleHideDeleteWordButtons(toHide: boolean) {
        const tableData = this.tableComponent.getTableData();

        tableData.forEach((item) => {
            const deleteButton = document.getElementById("delete-word-icon-" + item.id);
            if (deleteButton) {
                deleteButton.style.visibility = toHide ? 'hidden' : 'visible';
            }
        });
    }
}