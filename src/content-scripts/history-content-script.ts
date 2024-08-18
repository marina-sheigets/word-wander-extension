import { container } from "tsyringe";
import { BackgroundMessages } from "../constants/backgroundMessages";
import { HistoryItem } from "../types/History";
import { ChromeStorageKeys } from "../constants/chromeStorageKeys";

class HistoryContentScript {
    constructor() {
        addEventListener('message', async (event) => {
            switch (event.data.message) {
                case BackgroundMessages.UpdateHistory:
                    await this.changeChromeStorageHistory(event.data.data);
                    break;
                case BackgroundMessages.GetHistory:
                    await this.sendHistoryToPage();
                    break;

            }
        });

        chrome.runtime.onMessage.addListener((request) => {
            if (!request || !request.message) {
                return;
            }

            switch (request.message) {
                case BackgroundMessages.HistoryChanged:
                    this.sendHistoryToPage();
                    break;
            }
        });
    }

    private async changeChromeStorageHistory(history: HistoryItem[]) {
        try {
            await chrome.storage.local.set({ [ChromeStorageKeys.History]: history });
        } catch (error) {
            console.error('Error changing Chrome storage history:', error);
        }
    }

    async getHistory() {
        try {
            const history = await chrome.storage.local.get(ChromeStorageKeys.History);
            return history[ChromeStorageKeys.History] || [];
        } catch (e) {
            console.error(e);
        }
    }

    async sendHistoryToPage() {
        try {
            const history = await this.getHistory();
            postMessage({ message: BackgroundMessages.SyncHistory, data: history });
        } catch (error) {
            console.error('Error getting settings:', error);
        }
    }
}

container.register('BundleName', {
    useValue: 'history-content-script'
});

container.resolve(HistoryContentScript);