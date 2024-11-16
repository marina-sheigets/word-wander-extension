import { singleton } from "tsyringe";
import { HttpService } from "../http/http.service";
import { MessengerService } from "../messenger/messenger.service";
import { Messages } from "../../constants/messages";
import { UserService } from "../user/user.service";
import { SettingsService } from "../settings/settings.service";
import { BackgroundMessages } from "../../constants/backgroundMessages";

@singleton()
export class AuthService {
    private isAuth: boolean = false;

    constructor(
        protected http: HttpService,
        protected messenger: MessengerService,
        protected userService: UserService,
        protected settingsService: SettingsService
    ) {

        this.messenger.subscribeOnBackgroundMessage(BackgroundMessages.UserAuthorized, (data) => {
            // Only update if there's a change in the authorization state
            if (this.isAuth !== data.isAuthorized) {
                this.isAuth = data.isAuthorized;

                if (!data.isAuthorized) {
                    this.userService.saveUserData(null);
                }
            }
        });
    }


    public isAuthorized() {
        return this.isAuth;
    }

    public async signUp(email: string, password: string) {
        try {
            const response = await this.http.post('/auth/signup', { email, password });

            if (!response || (response && response.data.error)) {
                throw Error;
            }

            this.isAuth = true;
            this.messenger.sendToBackground(BackgroundMessages.UserAuthorized, { isAuthorized: true });
            this.userService.saveUserData(response.data);

            this.closeSignInPopup();
        } catch (e) {
            if (e?.response.data.error && e?.response.data.message === "User already exists") {
                this.login(email, password);
                return;
            }

            if (e.response.data.error.message) {
                this.messenger.send(Messages.ShowAuthError, e.response.data.error.message);
            }
        }
    }

    public async login(email: string, password: string) {
        try {
            const response = await this.http.post('/auth/login', { email, password });

            if (!response || (response && response.data.error)) {
                throw Error;
            }

            this.isAuth = true;
            this.messenger.sendToBackground(BackgroundMessages.UserAuthorized, { isAuthorized: true });
            this.userService.saveUserData(response.data);

            this.closeSignInPopup();
        } catch (e) {
            if (e.response.data.message) {
                this.messenger.send(Messages.ShowAuthError, e.response.data.message);
            }
        }
    }

    public closeSignInPopup() {
        this.messenger.send(Messages.CloseSignInPopup);
    }

    public async resetPassword(email: string) {
        try {
            const response = await this.http.post('/auth/forgot-password', { email });

            if (!response || (response && response.data.error)) {
                throw Error;
            }

            this.messenger.send(Messages.CloseResetPasswordPopup);
        } catch (e) {
            throw e;
        }
    }
}