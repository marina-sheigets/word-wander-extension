import { ButtonComponent } from "../../../button/button.component";
import { MenuComponent } from "../../../menu/menu.component";
import * as styles from './history-menu.component.css';
import { IconService } from "../../../../services/icon/icon.component";
import { WordTranslationComponent } from "../../../word-translation/word-translation.component";
import { singleton } from "tsyringe";
import { MessengerService } from "../../../../services/messenger/messenger.service";
import { Messages } from "../../../../constants/messages";
import { HistoryService } from "../../../../services/history/history.service";
import { HistoryItem } from "../../../../types/History";
import { i18nKeys } from "../../../../services/i18n/i18n-keys";

@singleton()
export class HistoryMenuComponent extends MenuComponent {
    emptyResultContainer = document.createElement('div');
    historyContainer = document.createElement('div');

    constructor(
        private clearHistoryButton: ButtonComponent,
        protected iconService: IconService,
        protected messenger: MessengerService,
        protected historyService: HistoryService
    ) {
        super();

        this.applyRootStyle(styles);

        this.emptyResultContainer.textContent = 'There is no history';

        this.historyContainer.classList.add(styles.historyContainer);
        this.emptyResultContainer.classList.add(styles.emptyResultContainer);

        this.clearHistoryButton.addButtonName(i18nKeys.ClearHistory);
        this.clearHistoryButton.addButtonIcon('delete');

        this.clearHistoryButton.onClick.subscribe(this.clearHistory.bind(this));
        this.clearHistoryButton.rootElement.classList.add(styles.clearHistoryButton);

        this.rootElement.append(
            this.clearHistoryButton.rootElement,
            this.emptyResultContainer,
            this.historyContainer
        )

        this.historyService.historyUpdated.follow(this.setContent.bind(this));
        this.messenger.subscribe(Messages.CloseAllMenus, this.hide.bind(this));
    }

    setContent() {
        const history = this.historyService.getHistory();

        if (history.length) {

            this.historyContainer.innerHTML = '';

            history.forEach((item: HistoryItem) => {
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
        this.historyService.clearHistory();
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