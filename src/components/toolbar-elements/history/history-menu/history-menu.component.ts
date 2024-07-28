import { STORAGE_KEYS } from "../../../../constants/localStorage-keys";
import { LocalStorageService } from "../../../../services/localStorage/localStorage.service";
import { ButtonComponent } from "../../../button/button.component";
import { MenuComponent } from "../../../menu/menu.component";
import * as styles from './history-menu.component.css';
import { IconService } from "../../../../services/icon/icon.component";
import { WordTranslationComponent } from "../../../word-translation/word-translation.component";
import { singleton } from "tsyringe";

interface HistoryItem {
    translation: string,
    word: string;
}

@singleton()
export class HistoryMenuComponent extends MenuComponent {
    emptyResultContainer = document.createElement('div');
    historyContainer = document.createElement('div');

    constructor(
        private clearHistoryButton: ButtonComponent,
        private localStorage: LocalStorageService,
        protected iconService: IconService,
    ) {
        super();

        this.applyRootStyle(styles);

        this.emptyResultContainer.textContent = 'There is no history';

        this.historyContainer.classList.add(styles.historyContainer);
        this.emptyResultContainer.classList.add(styles.emptyResultContainer);

        this.clearHistoryButton.addButtonName('Clear history');
        this.clearHistoryButton.addButtonIcon('delete');

        this.clearHistoryButton.onClick.subscribe(this.clearHistory.bind(this))
        this.rootElement.append(
            this.clearHistoryButton.rootElement,
            this.emptyResultContainer,
            this.historyContainer
        )
    }

    setContent() {
        const history = this.localStorage.get(STORAGE_KEYS.History);

        if (history) {
            const historyItems = JSON.parse(history);

            this.historyContainer.innerHTML = '';

            historyItems.forEach((item: HistoryItem) => {
                const wordTranslationComponent = new WordTranslationComponent(this.iconService);
                wordTranslationComponent.addPair(item.word, item.translation);
                this.historyContainer.append(wordTranslationComponent.rootElement);
            });

            this.showHistory();
        } else {
            this.hideHistory();
        }
    }

    clearHistory() {
        this.localStorage.delete(STORAGE_KEYS.History);
        this.hideHistory();
    }

    showHistory() {
        this.clearHistoryButton.rootElement.classList.remove(styles.hidden);
        this.emptyResultContainer.classList.add(styles.hidden);
        this.historyContainer.classList.remove(styles.hidden);
    }

    hideHistory() {
        this.clearHistoryButton.rootElement.classList.add(styles.hidden);
        this.emptyResultContainer.classList.remove(styles.hidden);
        this.historyContainer.classList.add(styles.hidden);
    }
}