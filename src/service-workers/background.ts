import 'reflect-metadata';
import { container, singleton } from "tsyringe";
import { BackgroundMessages } from '../constants/backgroundMessages';
import { ChromeStorageKeys } from '../constants/chromeStorageKeys';

@singleton()
export class Background {
    constructor() {

        chrome.runtime.onMessage.addListener((request) => {
            if (!request || !request.type || !Object.values(BackgroundMessages).includes(request.type)) {
                return;
            }
        });

        chrome.storage.onChanged.addListener((changes) => {
            if (changes[ChromeStorageKeys.Settings]) {
                this.notifyTabs(BackgroundMessages.SettingsChanged, changes[ChromeStorageKeys.Settings].newValue);
                return;
            }

            if (changes[ChromeStorageKeys.History]) {
                this.notifyTabs(BackgroundMessages.HistoryChanged, changes[ChromeStorageKeys.History].newValue);
                return;
            }
        });

    }

    private notifyTabs(message: string, data: any) {
        chrome.tabs.query({}, (tabs) => {
            if (chrome.runtime.lastError) {
                console.error('Error querying tabs:', chrome.runtime.lastError);
                return;
            }

            tabs.forEach((tab) => {
                if (tab.url && tab.url.indexOf('chrome://') === 0) {
                    return;
                }

                chrome.tabs.sendMessage(tab.id || 0, { message, data }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error('Error sending message to tab:', chrome.runtime.lastError);
                    } else {
                        console.log('Message sent to tab', tab.id, response);
                    }
                });
            });
        });
    };
}

container.register('BundleName', {
    useValue: 'background',
});

container.resolve(Background);
