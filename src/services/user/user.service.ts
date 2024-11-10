import { singleton } from "tsyringe";
import { AuthorizationData } from "../../types/AuthorizationData";
import { SettingsService } from "../settings/settings.service";
import { SettingsNames } from "../../constants/settingsNames";

@singleton()
export class UserService {

    constructor(
        protected settingsService: SettingsService
    ) { }

    public saveUserData(data: AuthorizationData) {
        this.settingsService.set(SettingsNames.User, data);
    }

    public getUserData(): AuthorizationData | null {
        return this.settingsService.get(SettingsNames.User);
    }
}