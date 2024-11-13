import { singleton } from "tsyringe";
import { Messages } from "../../constants/messages";
import { AuthService } from "../auth/auth.service";
import { MessengerService } from "../messenger/messenger.service";
import { HttpService } from "../http/http.service";

@singleton()
export class DictionaryService {
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
}