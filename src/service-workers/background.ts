import 'reflect-metadata';
import { container, singleton } from "tsyringe";
import { BackgroundMessages } from '../constants/backgroundMessages';
import { ChromeStorageKeys } from '../constants/chromeStorageKeys';
import { getTrainingsPageURL } from '../utils/getTrainingsPageURL';
import { URL } from '../constants/urls';
import { SettingsNames } from '../constants/settingsNames';
import { debounce } from '../utils/debounce';

@singleton()
export class Background {
    private debouncedRefreshToken: () => void;

    constructor() {

        chrome.runtime?.onMessage.addListener((request) => {

            if (!request || !request.type || !Object.values(BackgroundMessages).includes(request.type)) {
                console.error('Invalid request:', request);
                return;
            }

            switch (request.type) {
                case BackgroundMessages.GoToTrainings: {
                    this.goToTrainingsPage();
                    break;
                }
                case BackgroundMessages.DictionarySync: {
                    this.notifyTabs(BackgroundMessages.DictionarySync, request.data);
                    break;
                }

                case BackgroundMessages.CloseAllSignInPopups: {
                    this.notifyTabs(BackgroundMessages.SyncAllAuthPopupsClosed, request.data);
                    break;
                }
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

        this.debouncedRefreshToken = debounce(this.refreshToken.bind(this), 1000);

        chrome.windows.onCreated.addListener(async () => {
            this.debouncedRefreshToken();
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
                        console.error(
                            'Error sending message to tab:', chrome.runtime.lastError,
                            "\nTab name:", tab.title, "Message:", message, "Data:", data
                        );
                    } else {
                        console.log('Message sent to tab', tab.id, response);
                    }
                });
            });
        });
    };

    private goToTrainingsPage() {
        chrome.tabs.query({}, (tabs) => {
            const trainingsTab = tabs.find(tab => tab.url?.includes('trainings'));
            if (trainingsTab) {
                chrome.tabs.update(trainingsTab.id || 0, { active: true });
            } else {
                chrome.tabs.create({ url: getTrainingsPageURL(), active: true });
            }
        });
    }

    private async refreshToken() {
        try {
            const userData = await this.getSetting(SettingsNames.User);

            const refreshToken = userData?.refreshToken;

            if (!refreshToken) {
                throw new Error("Bad request");
            }

            const response = await fetch(process.env.API_URL + URL.auth.refreshToken, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: refreshToken,
                }),
            });

            const data = await response.json();

            if (!data.accessToken || !data.refreshToken) {
                throw new Error("Invalid data received");
            }

            await this.updateStorage(data, SettingsNames.User);
        } catch (e) {
            await this.updateStorage(null, SettingsNames.User);
        }
    }

    private async updateStorage(data: any, settingName: SettingsNames) {
        try {
            const savedSettings = await chrome.storage.local.get([ChromeStorageKeys.Settings]);
            const updatedSettings = { ...savedSettings[ChromeStorageKeys.Settings], [settingName]: data };
            await chrome.storage.local.set({ [ChromeStorageKeys.Settings]: updatedSettings });
        } catch (error) {
            console.error('Error updating storage:', error);
        }
    }

    private async getSetting(settingName: SettingsNames) {
        const savedSettings = await chrome.storage.local.get([ChromeStorageKeys.Settings]);
        return savedSettings[ChromeStorageKeys.Settings][settingName];
    }
}

container.register('BundleName', {
    useValue: 'background',
});

container.resolve(Background);
