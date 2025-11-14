import { singleton } from "tsyringe";
import { MenuComponent } from "../../../menu/menu.component";
import * as styles from './search-menu.component.css';
import { InputComponent } from "../../../input/input.component";
import { ButtonComponent } from "../../../button/button.component";
import { LoaderComponent } from "../../../loader/loader.component";
import { SearchContentComponent } from "../search-content/search-content.component";
import { MessengerService } from "../../../../services/messenger/messenger.service";
import { Messages } from "../../../../constants/messages";
import { SearchErrorPopupComponent } from "../../../popups/search-error/search-error.component";
import { DictionaryApiService } from "../../../../services/api/dictionary-api/dictionary-api.service";
import { HistoryService } from "../../../../services/history/history.service";
import { i18nKeys } from "../../../../services/i18n/i18n-keys";
import { RandomWordContainerComponent } from "../../../random-word-container/random-word-container.component";
import { IconName } from "../../../../types/IconName";
import { I18nService } from "../../../../services/i18n/i18n.service";
import { UserStatisticsService } from "../../../../services/user-statistics/user-statistics.service";
import { StatisticsPath } from "../../../../constants/statisticsPaths";
import { TranslationService } from "../../../../services/api/translation/translation.service";

@singleton()
export class SearchMenuComponent extends MenuComponent {
    searchContainer = document.createElement('div');
    emptyContainer = document.createElement('div');
    content = document.createElement('div');
    searchValue: string = '';

    constructor(
        private inputComponent: InputComponent,
        private searchButton: ButtonComponent,
        private translationService: TranslationService,
        private loader: LoaderComponent,
        private searchContent: SearchContentComponent,
        protected messenger: MessengerService,
        protected searchErrorPopup: SearchErrorPopupComponent,
        protected dictionaryService: DictionaryApiService,
        protected historyService: HistoryService,
        protected randomWordContainer: RandomWordContainerComponent,
        protected userStatistics: UserStatisticsService,
        protected i18n: I18nService
    ) {
        super();

        this.applyRootStyle(styles);

        this.searchButton.addButtonIcon(IconName.Search);
        this.searchButton.rootElement.classList.add(styles.searchButton);

        this.inputComponent.setInputSettings('text', i18nKeys.TypeSomething);

        this.searchButton.onClick.subscribe(() => {
            this.onSearch(this.inputComponent.input.value)
        })

        this.searchContainer.classList.add(styles.searchContainer);
        this.emptyContainer.classList.add(styles.emptyContainer);
        this.emptyContainer.classList.add(styles.hidden);
        this.content.classList.add(styles.content);


        this.searchContainer.append(
            this.inputComponent.rootElement,
            this.searchButton.rootElement
        )

        this.content.append(
            this.randomWordContainer.rootElement,
            this.emptyContainer,
            this.loader.rootElement,
            this.searchContent.rootElement
        )
        this.rootElement.append(
            this.searchContainer,
            this.content
        );

        this.messenger.subscribe(Messages.CloseAllMenus, this.hide.bind(this));

        this.searchContent.onClear.subscribe(() => {
            this.randomWordContainer.rootElement.classList.remove(styles.hidden);
            this.searchContent.hide();
            this.inputComponent.input.value = '';
        });

        this.randomWordContainer.onRandomizeWord.subscribe(this.randomizeWord.bind(this));

    }

    private async randomizeWord() {
        this.randomWordContainer.rootElement.classList.add(styles.hidden);
        const randomWord = await this.dictionaryService.getRandomWord();

        if (randomWord) {
            this.inputComponent.input.value = randomWord.word;
            this.searchContent.clearData();
            this.emptyContainer.classList.add(styles.hidden);
            this.searchContent.fillWithData(randomWord.word, '', randomWord.dictionaryResult);
            this.searchContent.show();
        }
    }

    private async onSearch(value: string) {
        this.emptyContainer.classList.add(styles.hidden);

        if (value.trim().length === 0 || value === this.searchContent.getWord()) {
            return;
        }

        if (value.trim().split(' ').length > 1) {
            this.searchErrorPopup.show();
            return;
        }

        this.searchValue = value;
        this.searchContent.clearData();

        this.searchContent.hide();
        this.loader.show();
        this.searchButton.disable();
        this.inputComponent.setDisabled();
        this.randomWordContainer.rootElement.classList.add(styles.hidden);

        const translation: string = await this.translationService.translateText(value);

        this.userStatistics.updateStatistics({ fieldPath: StatisticsPath.TOTAL_SEARCHED_WORDS });

        const dictionaryResult = await this.dictionaryService.fetchData(value);

        this.loader.hide();
        this.searchButton.enable();
        this.inputComponent.setEnabled();

        if (translation && dictionaryResult) {
            this.historyService.addHistoryItem(translation, value);
            this.searchContent.fillWithData(value, translation, dictionaryResult);

            this.searchContent.show();
        } else {
            this.i18n.follow(i18nKeys.NoDefinitions, (text) => {
                this.emptyContainer.textContent = text;
            });
            this.emptyContainer.classList.remove(styles.hidden);
        }
    }

    public setAutomaticSearch(value: string) {
        this.inputComponent.input.value = value;
        this.onSearch(value);
    }
}