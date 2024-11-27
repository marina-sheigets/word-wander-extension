import { ButtonComponent } from "../../../button/button.component";
import { MenuComponent } from "../../../menu/menu.component";
import * as styles from './history-menu.component.css';
import { WordTranslationComponent } from "../../../word-translation/word-translation.component";
import { singleton } from "tsyringe";
import { MessengerService } from "../../../../services/messenger/messenger.service";
import { Messages } from "../../../../constants/messages";
import { HistoryService } from "../../../../services/history/history.service";
import { HistoryItem } from "../../../../types/History";
import { i18nKeys } from "../../../../services/i18n/i18n-keys";
import { IconComponent } from "../../../icon/icon.component";
import { IconName } from "../../../../types/IconName";
import { I18nService } from "../../../../services/i18n/i18n.service";
import { TextToSpeechService } from "../../../../services/text-to-speech/text-to-speech.service";
import { DictionaryService } from "../../../../services/dictionary/dictionary.service";

@singleton()
export class HistoryMenuComponent extends MenuComponent {
    emptyResultContainer = document.createElement('div');
    historyContainer = document.createElement('div');

    constructor(
        private clearHistoryButton: ButtonComponent,
        protected icon: IconComponent,
        protected messenger: MessengerService,
        protected historyService: HistoryService,
        protected i18n: I18nService,
        protected textToSpeechService: TextToSpeechService,
        protected dictionaryService: DictionaryService
    ) {
        super();

        this.applyRootStyle(styles);

        this.emptyResultContainer.textContent = 'There is no history';

        this.historyContainer.classList.add(styles.historyContainer);
        this.emptyResultContainer.classList.add(styles.emptyResultContainer);

        this.clearHistoryButton.addButtonName(i18nKeys.ClearHistory);
        this.clearHistoryButton.addButtonIcon(IconName.Delete);

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
                const playButton = new ButtonComponent(this.i18n);
                playButton.addButtonIcon(IconName.Play);
                playButton.addTooltip(i18nKeys.Play);
                playButton.onClick.subscribe(() => {
                    this.textToSpeechService.play(item.word);
                });

                const translation = new WordTranslationComponent(this.icon);
                translation.addPair(item.word, item.translation, false);


                const addWordButton = new ButtonComponent(this.i18n);
                addWordButton.addButtonIcon(IconName.Plus);
                addWordButton.addTooltip(i18nKeys.AddToDictionary);
                addWordButton.onClick.subscribe(async () => {
                    this.dictionaryService.addWordToDictionary(item.word, item.translation)
                        .then(() => {
                            this.historyService.removeItemFromHistory(item);
                        });
                });
                this.historyContainer.append(
                    playButton.rootElement,
                    translation.rootElement,
                    addWordButton.rootElement

                );
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