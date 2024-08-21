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
import { GoogleTranslateService } from "../../../../services/api/google-translate/google-translate.service";
import { HistoryService } from "../../../../services/history/history.service";
import { i18nKeys } from "../../../../services/i18n/i18n-keys";

@singleton()
export class SearchMenuComponent extends MenuComponent {
    searchContainer = document.createElement('div');
    emptyContainer = document.createElement('div');
    content = document.createElement('div');
    searchValue: string = '';

    constructor(
        private inputComponent: InputComponent,
        private searchButton: ButtonComponent,
        private googleTranslateService: GoogleTranslateService,
        private loader: LoaderComponent,
        private searchContent: SearchContentComponent,
        protected messenger: MessengerService,
        protected searchErrorPopup: SearchErrorPopupComponent,
        protected dictionaryService: DictionaryApiService,
        protected historyService: HistoryService
    ) {
        super();

        this.applyRootStyle(styles);

        this.searchButton.addButtonIcon('search');
        this.searchButton.rootElement.classList.add(styles.searchButton);

        this.inputComponent.setInputSettings('text', i18nKeys.TypeSomething);
        this.inputComponent.onChange.subscribe(this.onSearch.bind(this));
        this.searchButton.onClick.subscribe(() => {
            this.onSearch(this.inputComponent.input.value)
        })

        this.searchContainer.classList.add(styles.searchContainer);
        this.emptyContainer.classList.add(styles.emptyContainer);
        this.content.classList.add(styles.content);

        this.emptyContainer.textContent = 'No results...';

        this.searchContainer.append(
            this.inputComponent.rootElement,
            this.searchButton.rootElement
        )

        this.content.append(
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
            this.emptyContainer.classList.remove(styles.hidden);
            this.searchContent.hide();
        });
    }

    private async onSearch(value: string) {
        if (value.trim().length === 0 || value === this.searchValue) {
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
        this.emptyContainer.classList.add(styles.hidden);

        const translations: string[] = await this.googleTranslateService.translateText(value);
        const dictionaryResult = await this.dictionaryService.fetchData(value);

        this.loader.hide();
        this.searchButton.enable();
        this.inputComponent.setEnabled();

        if (translations.length && dictionaryResult) {
            this.historyService.addHistoryItem(translations, value);
            this.searchContent.fillWithData(value, translations, dictionaryResult);

            this.searchContent.show();
        } else {
            this.emptyContainer.textContent = "No definition found. Try another word.";
            this.emptyContainer.classList.remove(styles.hidden);
        }
    }

    public setAutomaticSearch(value: string) {
        this.inputComponent.input.value = value;
        this.onSearch(value);
    }
}