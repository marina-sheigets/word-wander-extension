import { singleton } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import { I18nService } from "../../services/i18n/i18n.service";
import { i18nKeys } from "../../services/i18n/i18n-keys";
import * as styles from "./dictionary-table.component.css";
import { ButtonComponent } from "../button/button.component";

@singleton()
export class DictionaryTableComponent extends BaseComponent {
    private amountWordsLabel = document.createElement('div');
    private tableHeaderTools = document.createElement('div');
    constructor(
        protected i18n: I18nService,
        protected selectAllButton: ButtonComponent,
        protected sendOnTrainingButton: ButtonComponent,
    ) {
        super();

        this.selectAllButton.addButtonName(i18nKeys.SelectAll);
        this.selectAllButton.rootElement.classList.add(styles.selectAllButton);

        this.sendOnTrainingButton.addButtonName(i18nKeys.SendOnTraining);
        this.amountWordsLabel.classList.add(styles.amountWords);
        this.tableHeaderTools.classList.add(styles.tableHeaderTools);

        this.i18n.follow(i18nKeys.AmountWords, (value) => {
            this.amountWordsLabel.innerText = 150 + value;
        });

        this.tableHeaderTools.append(
            this.selectAllButton.rootElement,
            this.sendOnTrainingButton.rootElement
        );

        this.rootElement.append(
            this.amountWordsLabel,
            this.tableHeaderTools
        );
    }
}