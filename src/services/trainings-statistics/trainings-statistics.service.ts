import { singleton } from "tsyringe";
import { HistoryItem } from "../../types/History";
import { TrainingSound } from "../training-sound/training-sound.service";

@singleton()
export class TrainingsStatisticsService {
    protected rightWords: HistoryItem[] = [];
    protected wrongWords: HistoryItem[] = [];

    constructor() {

    }

    public addRightWord(word: HistoryItem) {
        TrainingSound.playCorrectSound();
        this.rightWords.push(word);
    }

    public addWrongWord(word: HistoryItem) {
        TrainingSound.playIncorrectSound()
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