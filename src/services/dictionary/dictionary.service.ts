import { singleton } from "tsyringe";
import { Messages } from "../../constants/messages";
import { AuthService } from "../auth/auth.service";
import { MessengerService } from "../messenger/messenger.service";
import { HttpService } from "../http/http.service";
import { URL } from "../../constants/urls";
import { DictionaryTableItem } from "../../types/DictionaryTableItem";
import { Informer } from "../informer/informer.service";
import { BackgroundMessages } from "../../constants/backgroundMessages";
import { isExtensionContext } from "../../utils/isExtensionContext";
import { ExtensionPageManagerService } from "../extension-page-manager/extension-page-manager.service";

@singleton()
export class DictionaryService {
    private data: DictionaryTableItem[] = [];
    public readonly onDataChanged = new Informer<DictionaryTableItem[]>();

    constructor(
        protected authService: AuthService,
        protected messenger: MessengerService,
        protected httpService: HttpService,
        protected extensionPageManager: ExtensionPageManagerService
    ) {
    }

    async addWordToDictionary(word: string, translation: string) {
        try {
            if (!this.authService.isAuthorized()) {
                this.messenger.send(Messages.OpenSignInPopup);
                throw Error;
            }
            await this.httpService.post(URL.dictionary.addWord, { word, translation })

            this.rerenderDictionary(word, translation);
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
                selected: false
            }));
            this.onDataChanged.inform(this.data);
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