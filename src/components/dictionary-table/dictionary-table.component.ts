import { singleton } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import { I18nService } from "../../services/i18n/i18n.service";
import * as styles from "./dictionary-table.component.css";
import { DictionaryService } from "../../services/dictionary/dictionary.service";
import { DictionaryTableItem } from "../../types/DictionaryTableItem";
import { MessengerService } from "../../services/messenger/messenger.service";
import { BackgroundMessages } from "../../constants/backgroundMessages";
import { GroupedWordsData } from "../../types/GroupedWordsData";
import { SettingsService } from "../../services/settings/settings.service";
import { SettingsNames } from "../../constants/settingsNames";
import { ComponentsFactory } from "../factories/component.factory.";
import { AuthorizationData } from "../../types/AuthorizationData";
import { WordListComponent } from "../word-list/word-list.component";
import { i18nKeys } from "../../services/i18n/i18n-keys";
import { DictionaryToolsComponent } from "../dictionary-tools/dictionary-tools.component";

@singleton()
export class DictionaryTableComponent extends BaseComponent {
    private initialData: DictionaryTableItem[] = [];

    private amountWordsLabel = document.createElement('div');

    private content = document.createElement('div');

    constructor(
        protected i18n: I18nService,
        protected dictionaryTools: DictionaryToolsComponent,
        protected dictionaryService: DictionaryService,
        protected messengerService: MessengerService,
        protected settingsService: SettingsService,
        protected componentsFactory: ComponentsFactory
    ) {
        super(styles);

        this.amountWordsLabel.classList.add(styles.amountWords);
        this.content.classList.add(styles.content);

        chrome.runtime?.onMessage?.addListener(async (request) => {
            if (
                request.type === BackgroundMessages.DictionarySync ||
                (request.message && request.message === BackgroundMessages.DictionarySync)
            ) {
                this.initialData = await this.dictionaryService.fetchDictionary();
                this.changeWordsInDictionaryLabel();
                this.initWordLists();
            }
        });

        this.settingsService.subscribe(SettingsNames.User, async (userData: AuthorizationData) => {
            if (!userData) return;
            this.initialData = await this.dictionaryService.fetchDictionary();
            this.changeWordsInDictionaryLabel();
            this.initWordLists();
        });

        this.rootElement.append(
            this.amountWordsLabel,
            this.dictionaryTools.rootElement,
            this.content
        );
    }

    private initWordLists() {
        this.dictionaryService.clearSelectedWords();

        this.content.textContent = '';

        if (!this.initialData.length) {
            this.i18n.follow(i18nKeys.EmptyDictionary, (value: string) => {
                this.content.textContent = value;
            });
            return;
        }

        const dataGroupedByDate = this.groupWordsByDate();

        for (let wordsGroup in dataGroupedByDate) {
            const key = wordsGroup as keyof GroupedWordsData;

            if (!dataGroupedByDate[key].length) {
                continue;
            }

            const wordList = this.componentsFactory.createComponent(WordListComponent);

            wordList.setData(key, dataGroupedByDate[key]);

            this.content.append(
                wordList.rootElement
            );
        }
    }

    private groupWordsByDate(): GroupedWordsData {
        const result: GroupedWordsData = {
            Today: [],
            Yesterday: [],
            LastWeek: [],
            LastMonth: [],
            Older: []
        };

        const now = new Date();

        for (const item of this.initialData) {
            const addedDate = new Date(item.added);

            const timeDiff = now.getTime() - addedDate.getTime();
            const oneDay = 1000 * 60 * 60 * 24;

            const daysAgo = Math.floor(timeDiff / oneDay);

            if (daysAgo <= 0) {
                result.Today.push(item);
            } else if (daysAgo === 1) {
                result.Yesterday.push(item);
            } else if (daysAgo <= 7) {
                result.LastWeek.push(item);
            } else if (daysAgo <= 30) {
                result.LastMonth.push(item);
            } else {
                result.Older.push(item);
            }
        }
        return result;
    }

    private changeWordsInDictionaryLabel() {
        if (this.initialData.length === 1) {
            this.i18n.follow(i18nKeys.OneWordInDictionary, (value) => {
                this.amountWordsLabel.textContent = value;
            });
            return;
        }

        this.i18n.follow(i18nKeys.SeveralWordsInDictionary, (value) => {
            this.amountWordsLabel.textContent = this.initialData.length + value;
        });

    }
}