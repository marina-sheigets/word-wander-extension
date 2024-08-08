import 'reflect-metadata';
import { container, singleton } from "tsyringe";
import { BackgroundMessages, ExtensionPrefix } from './constants/backgroundMessages';
import { DEFAULT_SETTINGS } from './constants/defaultSettings';

@singleton()
class ContentScript {
    constructor() {

        addEventListener('message', async (message) => {
            if (window === top) {
                try {
                    switch (message.data.message) {
                        case BackgroundMessages.UpdateSettings:
                            await this.changeChromeStorageSettings(message.data.data);
                            break;
                        case BackgroundMessages.GetSettings:
                            this.sendSettingsToPage();
                            break;
                    }
                } catch (error) {
                    console.error('Error handling message:', error);
                }
            }
        });

        chrome.runtime.onMessage.addListener((request) => {
            if (!request || !request.message) {
                return;
            }

            switch (request.message) {
                case BackgroundMessages.SettingsChanged:
                    this.sendSettingsToPage();
                    break;
            }
        });

    }
    async changeChromeStorageSettings(setting: { [key: string]: any }) {
        try {
            const savedSettings = await this.getSettings();

            const settings = { ...savedSettings, ...setting };

            chrome.storage.local.set({ [ExtensionPrefix + 'settings']: settings });
        } catch (error) {
            console.error('Error changing Chrome storage settings:', error);
        }
    }

    async getSettings() {
        const savedSettings = await chrome.storage.local.get([ExtensionPrefix + 'settings']);
        const settings = { ...DEFAULT_SETTINGS, ...savedSettings[ExtensionPrefix + 'settings'] };
        return settings
    }

    async sendSettingsToPage() {
        try {
            const settings = await this.getSettings();
            postMessage({ message: BackgroundMessages.SyncSettings, data: settings });
        } catch (error) {
            console.error('Error getting settings:', error);
        }
    }
}

container.register('BundleName', {
    useValue: 'content',
});

container.resolve(ContentScript);

