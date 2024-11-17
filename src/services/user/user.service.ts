import { singleton } from "tsyringe";
import { AuthorizationData } from "../../types/AuthorizationData";
import { SettingsService } from "../settings/settings.service";
import { SettingsNames } from "../../constants/settingsNames";
import { parseToken } from "../../utils/parseToken";
import { UserData } from "../../types/UserData";

@singleton()
export class UserService {

    constructor(
        protected settingsService: SettingsService
    ) { }

    public saveUserData(data: AuthorizationData | null) {
        this.settingsService.set(SettingsNames.User, data);
    }

    public getUserData(): AuthorizationData | null {
        return this.settingsService.get(SettingsNames.User);
    }

    public getRefreshToken(): string {
        const userData = this.getUserData();
        return userData?.refreshToken || '';
    }

    public getAccessToken(): string {
        const userData = this.getUserData();
        return userData?.accessToken || '';
    }

    public getUserInfo(): UserData {
        const token = this.getAccessToken();
        const data = parseToken(token);
        return {
            ...data,
            registrationDate: new Date(data.registrationDate).toLocaleDateString('en-US') // mm/dd/yyyy
        }
    }
}