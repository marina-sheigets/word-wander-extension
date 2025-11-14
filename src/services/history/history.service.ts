import { singleton } from 'tsyringe';
import { MessengerService } from '../messenger/messenger.service';
import { BackgroundMessages } from '../../constants/backgroundMessages';
import { Informer } from '../informer/informer.service';
import { HistoryItem } from '../../types/History';

@singleton()
export class HistoryService {
    private history: HistoryItem[] = [];
    public historyUpdated = new Informer();

    constructor(private messenger: MessengerService) {
        this.messenger.asyncSendToBackground(BackgroundMessages.GetHistory);

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

    public addHistoryItem(translation: string, word: string) {
        const item: HistoryItem = { translation, word };

        if (!this.isItemAlreadyInHistory(item)) {
            this.history.unshift(item);
        }

        this.checkHistoryLength();
    }

    public clearHistory() {
        this.history = [];
        this.historyUpdated.inform();
        this.messenger.asyncSendToBackground(BackgroundMessages.UpdateHistory, this.history);
    }

    private checkHistoryLength() {
        if (this.history.length > 7) {
            this.history.pop();
        }

        this.messenger.asyncSendToBackground(BackgroundMessages.UpdateHistory, this.history);
    }

    private isItemAlreadyInHistory(newItem: HistoryItem) {
        return this.history.some(
            (item) => item.word === newItem.word && item.translation === newItem.translation
        );
    }

    public removeItemFromHistory(item: HistoryItem) {
        this.history = this.history.filter((historyItem) => historyItem.word !== item.word);
        this.historyUpdated.inform();
        this.messenger.asyncSendToBackground(BackgroundMessages.UpdateHistory, this.history);
    }
}