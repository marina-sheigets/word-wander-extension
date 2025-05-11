import { singleton } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './collections.component.css';
import { BackgroundMessages } from "../../constants/backgroundMessages";
import { MessengerService } from "../../services/messenger/messenger.service";
import { SettingsService } from "../../services/settings/settings.service";
import { SettingsNames } from "../../constants/settingsNames";
import { AuthorizationData } from "../../types/AuthorizationData";
import { CollectionsService } from "../../services/collections/collections.service";
import { i18nKeys } from "../../services/i18n/i18n-keys";
import { I18nService } from "../../services/i18n/i18n.service";
import { DictionaryTableItem } from "../../types/DictionaryTableItem";
import { DictionaryService } from "../../services/dictionary/dictionary.service";
import { GroupedWordsByCollectionData } from "../../types/GroupedWordsData";
import { ComponentsFactory } from "../factories/component.factory.";
import { CollectionComponent } from "./collection/collection.component";

@singleton()
export class CollectionsComponent extends BaseComponent {
    private initialData: DictionaryTableItem[] = [];

    private amountWordsLabel = document.createElement('div');

    private content = document.createElement('div');

    constructor(
        protected i18n: I18nService,
        protected messengerService: MessengerService,
        protected settingsService: SettingsService,
        protected collectionsService: CollectionsService,
        protected dictionaryService: DictionaryService,
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
                await this.init();
            }
        });

        this.settingsService.subscribe(SettingsNames.User, async (userData: AuthorizationData) => {
            if (!userData) return;

            await this.init();
        });

        this.rootElement.append(
            this.amountWordsLabel,
            this.content
        );
    }

    private async init() {
        this.initialData = await this.dictionaryService.fetchDictionary();
        this.changeWordsInDictionaryLabel();
        this.initCollections();
    }

    private initCollections() {
        // this.collectionsService.clearSelectedWords();

        this.content.textContent = '';


        if (!this.initialData.length) {
            this.i18n.follow(i18nKeys.EmptyDictionary, (value: string) => {
                this.content.textContent = value;
            });

            return;
        }

        const dataGroupedByCollection = this.groupWordsByCollection();

        for (let collectionName in dataGroupedByCollection) {
            const collectionComponent = this.componentsFactory.createComponent(CollectionComponent);
            collectionComponent.setCollectionData(
                collectionName,
                dataGroupedByCollection[collectionName]
            );

            this.content.append(collectionComponent.rootElement);
        }
    }

    private groupWordsByCollection(): GroupedWordsByCollectionData {
        const result: GroupedWordsByCollectionData = {
            [i18nKeys.Default]: {
                collectionId: "",
                words: []
            }
        };

        this.initialData.forEach((word) => {
            if (!word.collections.length) {
                result[i18nKeys.Default].words.push(word);
                return;
            }

            word.collections.forEach((collection) => {
                if (!result[collection.name]) {
                    result[collection.name] = {
                        words: [],
                        collectionId: ""
                    }
                }
                result[collection.name].collectionId = collection._id;
                result[collection.name].words.push(word);
            });
        });

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