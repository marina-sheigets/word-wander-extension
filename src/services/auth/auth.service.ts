import { singleton } from "tsyringe";
import { HttpService } from "../http/http.service";
import { MessengerService } from "../messenger/messenger.service";
import { Messages } from "../../constants/messages";
import { UserService } from "../user/user.service";
import { SettingsService } from "../settings/settings.service";
import { SettingsNames } from "../../constants/settingsNames";
import { AuthorizationData } from "../../types/AuthorizationData";

@singleton()
export class AuthService {
    private isAuth: boolean = false;

    constructor(
        protected http: HttpService,
        protected messenger: MessengerService,
        protected userService: UserService,
        protected settingsService: SettingsService
    ) {
        this.settingsService.subscribe(SettingsNames.User, (userData: AuthorizationData) => {
            this.checkIfUserIsAuthorized(userData);
        });

        this.messenger.subscribe(Messages.UserAuthorized, (isAuthorized: boolean) => {
            // Only update if there's a change in the authorization state
            if (this.isAuth !== isAuthorized) {
                this.isAuth = isAuthorized;

                if (!isAuthorized) {
                    this.userService.saveUserData(null);
                }
            }
        });
    }

    private checkIfUserIsAuthorized(userData: AuthorizationData) {
        if (userData) {
            this.isAuth = true;
        }

        this.messenger.send(Messages.UserAuthorized, this.isAuth);
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
}