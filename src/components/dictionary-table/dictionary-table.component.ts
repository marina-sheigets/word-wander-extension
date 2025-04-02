import { singleton } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import { I18nService } from "../../services/i18n/i18n.service";
import { i18nKeys } from "../../services/i18n/i18n-keys";
import * as styles from "./dictionary-table.component.css";
import { ButtonComponent } from "../button/button.component";
import { TableComponent } from "./table/table.component";
import { DictionaryService } from "../../services/dictionary/dictionary.service";
import { DictionaryTableItem } from "../../types/DictionaryTableItem";
import { MessengerService } from "../../services/messenger/messenger.service";
import { Messages } from "../../constants/messages";
import { BackgroundMessages } from "../../constants/backgroundMessages";

@singleton()
export class DictionaryTableComponent extends BaseComponent {
    private amountWordsLabel = document.createElement('div');
    private tableHeaderTools = document.createElement('div');
    private wordsSelectedLabel = document.createElement('div');

    private selectedWords: DictionaryTableItem[] = [];

    constructor(
        protected i18n: I18nService,
        protected selectAllButton: ButtonComponent,
        protected unselectAllButton: ButtonComponent,
        protected removeSelectedWordsButton: ButtonComponent,
        protected sendOnTrainingButton: ButtonComponent,
        protected tableComponent: TableComponent,
        protected dictionaryService: DictionaryService,
        protected messengerService: MessengerService
    ) {
        super();

        this.selectedWords = [];

        this.selectAllButton.addButtonName(i18nKeys.SelectAll);
        this.selectAllButton.rootElement.classList.add(styles.selectAllButton);
        this.selectAllButton.onClick.subscribe(() => {
            this.tableComponent.toggleSelectAllWords(true);
            this.toggleHideDeleteWordButtons(true);
        });

        this.sendOnTrainingButton.addButtonName(i18nKeys.SendOnTraining);
        this.sendOnTrainingButton.hide();
        this.sendOnTrainingButton.onClick.subscribe(() => {
            this.messengerService.send(Messages.SendWordsOnTrainingPopup);
        });

        this.unselectAllButton.addButtonName(i18nKeys.UnselectAll);
        this.unselectAllButton.rootElement.classList.add(styles.selectAllButton);
        this.unselectAllButton.onClick.subscribe(() => {
            this.tableComponent.toggleSelectAllWords(false);
            this.toggleHideDeleteWordButtons(false);
        });
        this.unselectAllButton.hide();

        this.removeSelectedWordsButton.addButtonName(i18nKeys.RemoveSelectedWords);
        this.removeSelectedWordsButton.rootElement.classList.add(styles.selectAllButton);
        this.removeSelectedWordsButton.onClick.subscribe(() => {
            this.removeSelectedWords();
        });
        this.removeSelectedWordsButton.hide();

        this.amountWordsLabel.classList.add(styles.amountWords);
        this.tableHeaderTools.classList.add(styles.tableHeaderTools);

        this.wordsSelectedLabel.classList.add(styles.wordsSelectedLabel);

        this.dictionaryService.onDataChanged.subscribe(this.changeWordsInDictionaryLabel.bind(this));

        this.tableHeaderTools.append(
            this.selectAllButton.rootElement,
            this.unselectAllButton.rootElement,
            this.sendOnTrainingButton.rootElement,
            this.removeSelectedWordsButton.rootElement,
            this.wordsSelectedLabel
        );

        this.rootElement.append(
            this.amountWordsLabel,
            this.tableHeaderTools,
            this.tableComponent.rootElement
        );

        this.tableComponent.onSelectedChange.subscribe(this.changeWordsSelectedLabel.bind(this));

        chrome.runtime?.onMessage?.addListener(async (request) => {
            if (
                request.type === BackgroundMessages.DictionarySync ||
                (request.message && request.message === BackgroundMessages.DictionarySync)
            ) {
                this.restoreInitialToolsView();
            }
        });
    }

    private changeWordsSelectedLabel() {
        this.selectedWords = this.tableComponent.getTableData().filter(item => item.selected);

        this.toggleSelectAllWordsButtons(this.selectedWords.length);

        if (this.selectedWords.length) {
            this.removeSelectedWordsButton.show();
            this.sendOnTrainingButton.show();
            this.toggleHideDeleteWordButtons(true);

            if (this.selectedWords.length === 1) {
                this.i18n.follow(i18nKeys.OneWordSelected, (value) => {
                    this.wordsSelectedLabel.textContent = value;
                });
            } else {
                this.i18n.follow(i18nKeys.ManyWordsSelected, (value) => {
                    this.wordsSelectedLabel.textContent = this.selectedWords.length + value;
                });
            }
        } else {
            this.restoreInitialToolsView();
        }
    }

    private changeWordsInDictionaryLabel(data: DictionaryTableItem[]) {
        if (data.length === 1) {
            this.i18n.follow(i18nKeys.OneWordInDictionary, (value) => {
                this.amountWordsLabel.textContent = value;
            });
            return;
        }

        this.i18n.follow(i18nKeys.SeveralWordsInDictionary, (value) => {
            this.amountWordsLabel.textContent = data.length + value;
        });

        if (!data.length) {
            this.selectAllButton.hide();
            this.unselectAllButton.hide();

            return;
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
            const deleteButton = document.getElementById("delete-word-icon-" + item._id);
            if (deleteButton) {
                deleteButton.style.visibility = toHide ? 'hidden' : 'visible';
            }
        });
    }

    public filterWords(searchValue: string) {
        this.tableComponent.filterWords(searchValue);
    }

    private removeSelectedWords() {
        const selectedWordsIds = this.selectedWords.map(item => item._id);

        this.dictionaryService.removeWordsFromDictionary(selectedWordsIds).then(() => {
            this.selectAllButton.show();
            this.unselectAllButton.hide();
            this.restoreInitialToolsView();
        })
    }

    private restoreInitialToolsView() {
        this.toggleHideDeleteWordButtons(false);
        this.removeSelectedWordsButton.hide();
        this.sendOnTrainingButton.hide();
        this.wordsSelectedLabel.textContent = "";
    }
}