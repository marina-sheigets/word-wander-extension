import { singleton } from "tsyringe";
import { STORAGE_KEYS } from "../../constants/localStorage-keys";
import { HistoryItem } from "../../types/History";
import { LocalStorageService } from "../localStorage/localStorage.service";

@singleton()
export class HistoryService {
    private history: HistoryItem[] = [];

    constructor(
        private localStorage: LocalStorageService
    ) {
        this.initHistory();
    }

    private initHistory() {
        const historyObj = this.localStorage.get(STORAGE_KEYS.History) || '[]';
        this.history = JSON.parse(historyObj);
    }

    public getHistory() {
        return this.history;
    }

    public addHistoryItem(translations: string[], word: string) {
        const items: HistoryItem[] = translations.map((translation) => ({ translation, word }));

        this.history.unshift(...items);
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
        this.localStorage.set(STORAGE_KEYS.History, JSON.stringify(this.history));
    }
}