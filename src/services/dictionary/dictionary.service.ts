import { singleton } from "tsyringe";
import { Messages } from "../../constants/messages";
import { AuthService } from "../auth/auth.service";
import { MessengerService } from "../messenger/messenger.service";
import { HttpService } from "../http/http.service";
import { URL } from "../../constants/urls";
import { DictionaryTableItem } from "../../types/DictionaryTableItem";
import { Informer } from "../informer/informer.service";
import { BackgroundMessages } from "../../constants/backgroundMessages";

@singleton()
export class DictionaryService {
    private data: DictionaryTableItem[] = [];
    public readonly onDataChanged = new Informer<DictionaryTableItem[]>();

    constructor(
        protected authService: AuthService,
        protected messenger: MessengerService,
        protected httpService: HttpService
    ) {
    }

    async addWordToDictionary(word: string, translation: string) {
        try {
            if (!this.authService.isAuthorized()) {
                this.messenger.send(Messages.OpenSignInPopup);
                throw Error;
            }
            await this.httpService.post(URL.dictionary.addWord, { word, translation })

            this.messenger.asyncSendToBackground(BackgroundMessages.WordAddedToDictionary);
        } catch (e) {
            this.messenger.send(Messages.WordNotAddedToDictionary);
            throw Error;
        }
    }

    async fetchDictionary() {
        try {
            const response = await this.httpService.get(URL.dictionary.getWords);

            this.data = response?.data.map((item: any) => ({
                id: item._id,
                word: item.word,
                translation: item.translation,
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
}