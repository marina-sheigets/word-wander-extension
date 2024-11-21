import { singleton } from "tsyringe";
import { Messages } from "../../constants/messages";
import { AuthService } from "../auth/auth.service";
import { MessengerService } from "../messenger/messenger.service";
import { HttpService } from "../http/http.service";
import { URL } from "../../constants/urls";
import { DictionaryTableItem } from "../../types/DictionaryTableItem";
import { Informer } from "../informer/informer.service";

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
        if (!this.authService.isAuthorized()) {
            this.messenger.send(Messages.OpenSignInPopup);
            return;
        }

        try {
            const response = await this.httpService.post('dictionary/add-word', { word, translation })

            if (response?.status === 201) {
                this.messenger.send(Messages.WordAddedToDictionary);
            }
        } catch (e) {
            this.messenger.send(Messages.WordNotAddedToDictionary);
        }
    }

    async fetchDictionary() {
        try {
            const response = await this.httpService.get(URL.dictionary.getWords);

            this.data = response?.data.map((item: DictionaryTableItem) => ({ ...item, selected: false }));
            this.onDataChanged.inform(this.data);
            return this.data;
        } catch (e) {
            throw Error;
        }
    }

    public getDictionaryData() {
        return this.data;
    }
}