import { singleton } from "tsyringe";
import { Messages } from "../../constants/messages";
import { AuthService } from "../auth/auth.service";
import { MessengerService } from "../messenger/messenger.service";

@singleton()
export class DictionaryService {
    constructor(
        protected authService: AuthService,
        protected messenger: MessengerService
    ) {

    }

    addWordToDictionary(word: string, translations: string[]) {
        if (!this.authService.isAuthorized()) {
            this.messenger.send(Messages.OpenSignInPopup);
            return;
        }

        // Add word to dictionary
    }
}