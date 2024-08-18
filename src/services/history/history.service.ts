import { singleton } from "tsyringe";
import { STORAGE_KEYS } from "../../constants/localStorage-keys";
import { HistoryItem } from "../../types/History";
import { LocalStorageService } from "../localStorage/localStorage.service";
import { MessengerService } from "../messenger/messenger.service";
import { BackgroundMessages } from "../../constants/backgroundMessages";
import { Informer } from "../informer/informer.service";

@singleton()
export class HistoryService {
    private history: HistoryItem[] = [];
    public historyUpdated = new Informer();

    constructor(
        private localStorage: LocalStorageService,
        private messenger: MessengerService
    ) {
        this.messenger.sendToBackground(BackgroundMessages.GetHistory);

        this.listenToHistoryUpdates();
    }

    public getHistory() {
        return this.history;
    }

    private listenToHistoryUpdates() {
        addEventListener('message', (event) => {
            if (event.data.message === BackgroundMessages.SyncHistory) {
                this.history = event.data.data;
                this.historyUpdated.inform();
            }
        });
    }

    public addHistoryItem(translations: string[], word: string) {

        const items: HistoryItem[] = translations.map((translation) => ({ translation, word }));

        items.forEach((item) => {
            if (!this.isItemAlreadyInHistory(item)) {
                this.history.unshift(item);
            }
        });

        this.checkHistoryLength();
    }

    public clearHistory() {
        this.history = [];
        this.localStorage.delete(STORAGE_KEYS.History);
    }

    private checkHistoryLength() {
        if (this.history.length > 7) {
            this.history.pop();
        }

        this.messenger.sendToBackground(BackgroundMessages.UpdateHistory, this.history);
    }

    private isItemAlreadyInHistory(newItem: HistoryItem) {
        return this.history.some((item) => item.word === newItem.word && item.translation === newItem.translation);
    }
}