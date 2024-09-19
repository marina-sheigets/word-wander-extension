import { singleton } from "tsyringe";
import { DEFAULT_SETTINGS } from "../../constants/defaultSettings";
import { ChromeStorageKeys } from "../../constants/chromeStorageKeys";
import { BackgroundMessages } from "../../constants/backgroundMessages";


@singleton()
export class ExtensionPageManagerService {


    async getSettingsForExtensionPage() {
        const savedSettings = await chrome.storage.local.get([ChromeStorageKeys.Settings]);
        const settings = { ...DEFAULT_SETTINGS, ...savedSettings[ChromeStorageKeys.Settings] };
        return settings
    }

    async detectSettingsChange(callback: Function) {
        chrome.runtime.onMessage.addListener((request) => {
            if (!request || !request.message) {
                return;
            }

            switch (request.message) {
                case BackgroundMessages.SettingsChanged:
                    this.getSettingsForExtensionPage().then(settings => {
                        callback(settings);
                    });
                    break;
            }
        });
    }

}