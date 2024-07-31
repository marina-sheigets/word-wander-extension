import { singleton } from "tsyringe";
import { LocalStorageService } from "../localStorage/localStorage.service";
import { STORAGE_KEYS } from "../../constants/localStorage-keys";
import { DEFAULT_SETTINGS } from "../../constants/defaultSettings";

@singleton()
export class SettingsService {
    settings: { [key: string]: any } = {};

    constructor(
        protected localStorage: LocalStorageService
    ) {
        this.loadSettings();
    }

    loadSettings() {
        const savedSettings = this.localStorage.get(STORAGE_KEYS.Settings);
        if (savedSettings) {
            this.settings = JSON.parse(savedSettings);
        } else {
            this.settings = DEFAULT_SETTINGS;
        }
    }
}