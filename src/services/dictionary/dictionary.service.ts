import { singleton } from "tsyringe";
import { Messages } from "../../constants/messages";
import { AuthService } from "../auth/auth.service";
import { MessengerService } from "../messenger/messenger.service";
import { HttpService } from "../http/http.service";
import { URL } from "../../constants/urls";
import { DictionaryTableItem } from "../../types/DictionaryTableItem";
import { BackgroundMessages } from "../../constants/backgroundMessages";
import { isExtensionContext } from "../../utils/isExtensionContext";
import { ExtensionPageManagerService } from "../extension-page-manager/extension-page-manager.service";
import { UserStatisticsService } from "../user-statistics/user-statistics.service";
import { StatisticsPath } from "../../constants/statisticsPaths";
import { Informer } from "../informer/informer.service";

@singleton()
export class DictionaryService {
    private data: DictionaryTableItem[] = [];
    private selectedWordsIds: string[] = [];

    public onSelectedWordsChanged = new Informer<string[]>();

    constructor(
        protected authService: AuthService,
        protected messenger: MessengerService,
        protected httpService: HttpService,
        protected extensionPageManager: ExtensionPageManagerService,
        protected userStatistics: UserStatisticsService
    ) {
    }

    public addSelectedWords(wordsIds: string[]) {
        this.selectedWordsIds.push(...wordsIds);
        this.filterDuplicatedIds();
        this.onSelectedWordsChanged.inform(this.selectedWordsIds);
    }

    public filterUnselectedWords(wordsIds: string[]) {
        this.selectedWordsIds = this.selectedWordsIds.filter((selectedId) => !wordsIds.includes(selectedId));
        this.filterDuplicatedIds();
        this.onSelectedWordsChanged.inform(this.selectedWordsIds);
    }

    public clearSelectedWords() {
        this.selectedWordsIds = [];
        this.onSelectedWordsChanged.inform(this.selectedWordsIds);
    }

    private filterDuplicatedIds() {
        this.selectedWordsIds = [...new Set(this.selectedWordsIds)];
    }

    async addWordToDictionary(word: string, translation: string) {
        try {
            if (!this.authService.isAuthorized()) {
                this.messenger.send(Messages.OpenSignInPopup);
                throw Error;
            }
            const response = await this.httpService.post(URL.dictionary.addWord, { word, translation })

            this.userStatistics.updateStatistics({ fieldPath: StatisticsPath.ADDED_WORDS });

            this.rerenderDictionary(word, translation);
            return response?.data;
        } catch (e) {
            this.messenger.send(Messages.WordNotAddedToDictionary);
            throw Error;
        }
    }

    async fetchDictionary() {
        try {
            const response = await this.httpService.get(URL.dictionary.getWords);

            this.data = response?.data.map((item: any) => ({
                ...item,
                selected: false,
                added: item.updatedAt
            }));

            return this.data;
        } catch (e) {
            throw Error;
        }
    }

    public getDictionaryData() {
        return this.data;
    }

    public async removeWordFromDictionary(id: string) {
        try {
            const response = await this.httpService.delete(URL.dictionary.deleteWord, { wordId: id });

            this.userStatistics.updateStatistics({ fieldPath: StatisticsPath.TOTAL_DELETED_WORDS });

            this.rerenderDictionary("", "");
            return response;
        } catch (e) {
            throw e;
        }
    }

    public async addWordsToTrainings(selectedWordsIds: string[], selectedTrainings: string[]) {
        try {
            const response = await this.httpService.post(URL.training.sendWordsOnTrainings,
                {
                    wordsIds: selectedWordsIds,
                    trainings: selectedTrainings
                }
            );
            return response;
        } catch (e) {
            throw e;
        }
    }

    async removeWordsFromDictionary(selectedWordsIds: string[]) {
        try {
            const response = await this.httpService.delete(URL.dictionary.deleteWords, {}, { data: { wordsIds: selectedWordsIds } });

            this.userStatistics.updateStatistics({ fieldPath: StatisticsPath.TOTAL_DELETED_WORDS, count: selectedWordsIds.length });


            this.rerenderDictionary("", "");

            return response;
        } catch (e) {
            throw e;
        }
    }

    private rerenderDictionary(word: string, translation: string) {
        if (isExtensionContext()) {
            this.extensionPageManager.sendMessageToBackground(BackgroundMessages.DictionarySync, word);
        } else {
            this.messenger.asyncSendToBackground(BackgroundMessages.WordAddedToDictionary, { word, translation });
        }
    }
}