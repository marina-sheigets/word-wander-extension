import { singleton } from "tsyringe";
import { LocalStorageService } from "../localStorage/localStorage.service";
import { STORAGE_KEYS } from "../../constants/localStorage-keys";
import { DEFAULT_SETTINGS } from "../../constants/defaultSettings";

@singleton()
export class SettingsService {
    callbacks: { [key: string]: Function[] } = {};
    protected settings: { [key: string]: any } = {};

    constructor(
        protected localStorage: LocalStorageService
    ) {
        this.loadSettings();
    }

    subscribe(key: string, callback: Function) {
        if (this.callbacks[key]) {
            this.callbacks[key].push(callback);
        } else {
            this.callbacks[key] = [callback];
        }
    }

    follow(key: string, callback: Function) {
        this.subscribe(key, callback);
        callback(this.get(key));
    }

    loadSettings() {
        const savedSettings = this.localStorage.get(STORAGE_KEYS.Settings);
        if (savedSettings) {
            this.settings = JSON.parse(savedSettings);
        } else {
            this.settings = DEFAULT_SETTINGS;
        }
    }

    get(key: string) {
        return this.settings[key];
    }

    set(key: string, value: any) {
        this.settings[key] = value;
        this.inform(key);
    }

    inform(key: string) {
        if (this.callbacks[key]) {
            this.callbacks[key].forEach((callback) => {
                callback();
            });
        }

        this.localStorage.set(STORAGE_KEYS.Settings, JSON.stringify(this.settings));
    }

    getAllSettings() {
        return this.settings;
    }
}