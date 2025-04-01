import { singleton } from "tsyringe";
import { TrainingSound } from "../training-sound/training-sound.service";
import { trainings } from "../../constants/trainings";
import { HttpService } from "../http/http.service";
import { URL } from "../../constants/urls";
import { Word } from "../../types/Word";
import { ExtensionPageManagerService } from "../extension-page-manager/extension-page-manager.service";
import { BackgroundMessages } from "../../constants/backgroundMessages";

@singleton()
export class TrainingsStatisticsService {
    protected rightWords: Word[] = [];
    protected wrongWords: Word[] = [];

    constructor(
        protected httpService: HttpService,
        protected extensionPageManager: ExtensionPageManagerService
    ) {

    }

    public addRightWord(word: Word) {
        TrainingSound.playCorrectSound();
        this.rightWords.push(word);
    }

    public addWrongWord(word: Word) {
        TrainingSound.playIncorrectSound()
        this.wrongWords.push(word);
    }

    public getRightWords() {
        return this.rightWords;
    }

    public getWrongWords() {
        return this.wrongWords;
    }

    public clearStatistics(gameID: number) {
        if (!gameID) {
            return;
        }

        this.updateTrainingStatistics(gameID);
        this.removeRightWordsFromTraining(gameID);

        this.rightWords = [];
        this.wrongWords = [];
    }

    private updateTrainingStatistics(gameID: number) {
        const accuracyRate = this.rightWords.length / (this.rightWords.length + this.wrongWords.length);

        this.httpService.post(URL.training.finishTraining, {
            accuracyRate,
            trainingName: this.getTrainingName(gameID)
        });
    }

    private removeRightWordsFromTraining(gameID: number) {

        const rightWordsIds = this.rightWords.map((word) => word._id);


        if (!rightWordsIds.length) {
            return;
        }

        this.httpService.delete(URL.training.deleteWordsFromTraining, {},
            {
                data: {
                    wordsIds: rightWordsIds,
                    trainingName: this.getTrainingName(gameID)
                }
            })?.then(() => {
                this.extensionPageManager.sendMessageToBackground(BackgroundMessages.DictionarySync);
            });
    }

    private getTrainingName(gameID: number) {
        return trainings.find((training) => training.id === gameID)?.name;
    }
}