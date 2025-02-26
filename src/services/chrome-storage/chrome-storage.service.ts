import { singleton } from "tsyringe";
import { ChromeStorageKeys } from "../../constants/chromeStorageKeys";
import { SettingsNames } from "../../constants/settingsNames";
import { isExtensionContext } from "../../utils/isExtensionContext";

@singleton()
export class ChromeStorageService {
    private ErrorMessage = "Cannot access Chrome storage in this context"

    constructor() { }

    async get<T>(key: ChromeStorageKeys): Promise<T | null> {
        if (!isExtensionContext()) {
            console.warn(this.ErrorMessage);
            return null;
        }

        return new Promise((resolve) => {
            chrome.storage.local.get([key], (result) => {
                resolve(result[key] || null);
            });
        });
    }

    async set<T>(key: ChromeStorageKeys, value: T): Promise<boolean> {
        if (!isExtensionContext()) {
            console.warn(this.ErrorMessage);
            return false;
        }

        return new Promise((resolve) => {
            chrome.storage.local.set({ [key]: value }, () => {
                resolve(true);
            });
        });
    }

    async updateSettings(key: SettingsNames, value: any): Promise<boolean> {
        if (!isExtensionContext()) {
            console.warn(this.ErrorMessage);
            return false;
        }

        const currentSettings = await this.get<{ [key: string]: any }>(ChromeStorageKeys.Settings) || {};

        const newSettings = {
            ...currentSettings,
            [key]: value
        };

        return this.set(ChromeStorageKeys.Settings, newSettings);
    }

    addChangeListener(callback: (changes: { [key: string]: chrome.storage.StorageChange }) => void): () => void {
        if (!isExtensionContext()) {
            console.warn(this.ErrorMessage);
            return () => { };
        }

        const listener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
            callback(changes);
        };

        chrome.storage.onChanged.addListener(listener);

        return () => chrome.storage.onChanged.removeListener(listener);
    }
}