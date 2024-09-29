import { singleton } from "tsyringe";
import { HistoryItem } from "../../types/History";

@singleton()
export class TrainingsStatisticsService {
    protected rightWords: HistoryItem[] = [];
    protected wrongWords: HistoryItem[] = [];

    constructor() {

    }

    public addRightWord(word: HistoryItem) {
        this.rightWords.push(word);
    }

    public addWrongWord(word: HistoryItem) {
        this.wrongWords.push(word);
    }

    public getRightWords() {
        return this.rightWords;
    }

    public getWrongWords() {
        return this.wrongWords;
    }

    public clearStatistics() {
        this.rightWords = [];
        this.wrongWords = [];
    }
}