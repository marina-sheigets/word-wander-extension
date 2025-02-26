import { singleton } from "tsyringe";
import { ChromeStorageKeys } from "../../constants/chromeStorageKeys";
import { SettingsNames } from "../../constants/settingsNames";

@singleton()
export class ChromeStorageService {
    private ErrorMessage = "Cannot access Chrome storage in this context"

    constructor() { }

    public isExtensionContext() {
        return (typeof chrome !== 'undefined'
            && !!chrome.storage
            && (window.location.protocol === 'chrome-extension:' || chrome.extension?.getBackgroundPage?.() === window)
        );
    }

    async get<T>(key: ChromeStorageKeys): Promise<T | null> {
        if (!this.isExtensionContext) {
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
        if (!this.isExtensionContext) {
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
        if (!this.isExtensionContext) {
            console.warn(this.ErrorMessage);
            return false;
        }

        const currentSettings = await this.get<{ [key: string]: any }>(ChromeStorageKeys.Settings) || {};

        const newSettings = {
            ...currentSettings,
            [key]: value
        };

        debugger;
        return this.set(ChromeStorageKeys.Settings, newSettings);
    }

    addChangeListener(callback: (changes: { [key: string]: chrome.storage.StorageChange }) => void): () => void {
        if (!this.isExtensionContext) {
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