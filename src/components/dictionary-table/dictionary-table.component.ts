import { singleton } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import { I18nService } from "../../services/i18n/i18n.service";
import { i18nKeys } from "../../services/i18n/i18n-keys";
import * as styles from "./dictionary-table.component.css";
import { ButtonComponent } from "../button/button.component";
import { TableComponent } from "./table/table.component";

@singleton()
export class DictionaryTableComponent extends BaseComponent {
    private amountWordsLabel = document.createElement('div');
    private tableHeaderTools = document.createElement('div');
    private wordsSelectedLabel = document.createElement('div');

    constructor(
        protected i18n: I18nService,
        protected selectAllButton: ButtonComponent,
        protected sendOnTrainingButton: ButtonComponent,
        protected tableComponent: TableComponent
    ) {
        super();

        this.selectAllButton.addButtonName(i18nKeys.SelectAll);
        this.selectAllButton.rootElement.classList.add(styles.selectAllButton);

        this.sendOnTrainingButton.addButtonName(i18nKeys.SendOnTraining);
        this.sendOnTrainingButton.hide();

        this.amountWordsLabel.classList.add(styles.amountWords);
        this.tableHeaderTools.classList.add(styles.tableHeaderTools);

        this.wordsSelectedLabel.classList.add(styles.wordsSelectedLabel);

        this.i18n.follow(i18nKeys.AmountWords, (value) => {
            this.amountWordsLabel.innerText = 150 + value;
        });

        this.tableHeaderTools.append(
            this.selectAllButton.rootElement,
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
        const amountOfSelectedWords = this.tableComponent.getTableData().filter(item => item.selected).length;

        if (amountOfSelectedWords) {
            this.sendOnTrainingButton.show();

            if (amountOfSelectedWords === 1) {
                this.i18n.follow(i18nKeys.OneWordSelected, (value) => {
                    this.wordsSelectedLabel.textContent = value;
                })
            } else {
                this.i18n.follow(i18nKeys.ManyWordsSelected, (value) => {
                    this.wordsSelectedLabel.textContent = amountOfSelectedWords + value;
                })
            }
        } else {
            this.sendOnTrainingButton.hide();
            this.wordsSelectedLabel.textContent = "";
        }

    }
}