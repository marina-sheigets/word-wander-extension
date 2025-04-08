import { singleton } from "tsyringe";
import { HttpService } from "../http/http.service";
import { MessengerService } from "../messenger/messenger.service";
import { Messages } from "../../constants/messages";
import { UserService } from "../user/user.service";
import { URL } from "../../constants/urls";
import { SettingsService } from "../settings/settings.service";
import { SettingsNames } from "../../constants/settingsNames";
import { AuthorizationData } from "../../types/AuthorizationData";
import { BackgroundMessages } from "../../constants/backgroundMessages";
import { ExtensionPageManagerService } from "../extension-page-manager/extension-page-manager.service";
import { isExtensionContext } from "../../utils/isExtensionContext";

@singleton()
export class AuthService {
    private isAuth: boolean = false;

    constructor(
        protected http: HttpService,
        protected messenger: MessengerService,
        protected userService: UserService,
        protected settingsService: SettingsService,
        protected extensionPageManager: ExtensionPageManagerService,
    ) {
        this.settingsService.subscribe(SettingsNames.User, (user: AuthorizationData) => {
            this.isAuth = !!user;
        });
    }


    public isAuthorized() {
        return this.isAuth;
    }

    public async signUp(email: string, password: string) {
        try {
            const response = await this.http.post(URL.auth.signUp, { email, password });

            if (!response?.data) {
                throw Error;
            }

            this.isAuth = true;
            this.userService.saveUserData(response.data);

            this.closeAllSignInPopups();
        } catch (e) {
            if (e?.response.data && e?.response.data.message?.message === "User already exists") {
                this.login(email, password);
                return;
            }
            this.messenger.send(Messages.ShowAuthError, e.response.data.message.message);
        }
    }

    public async login(email: string, password: string) {
        try {
            const response = await this.http.post('/auth/login', { email, password });

            this.isAuth = true;
            this.userService.saveUserData(response?.data);

            this.closeAllSignInPopups();
        } catch (e) {
            if (e?.response?.data?.message) {
                this.messenger.send(Messages.ShowAuthError, e.response.data.message.message);
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

    public async changePassword(oldPassword: string, newPassword: string) {
        try {
            const response = await this.http.put(URL.auth.changePassword, { oldPassword, newPassword });
            return response;
        } catch (e) {
            throw e;
        }
    }

    public async signOut() {
        try {
            const response = await this.http.post(URL.auth.signOut, {});
            return response;
        } catch (e) {
            throw e;
        }
    }

    public async deleteAccount() {
        try {
            const response = await this.http.delete(URL.auth.deleteAccount);
            return response;
        } catch (e) {
            throw e;
        }
    }

    private closeAllSignInPopups() {
        this.closeSignInPopup();

        if (isExtensionContext()) {
            this.extensionPageManager.sendMessageToBackground(BackgroundMessages.CloseAllSignInPopups);
            return;
        }

        this.messenger.asyncSendToBackground(BackgroundMessages.CloseAllSignInPopups);
    }
}