import { singleton } from "tsyringe";
import { TrainingSound } from "../training-sound/training-sound.service";
import { trainings } from "../../constants/trainings";
import { HttpService } from "../http/http.service";
import { URL } from "../../constants/urls";
import { Word } from "../../types/Word";
import { ExtensionPageManagerService } from "../extension-page-manager/extension-page-manager.service";
import { BackgroundMessages } from "../../constants/backgroundMessages";
import { UserStatisticsService } from "../user-statistics/user-statistics.service";
import { StatisticsPath } from "../../constants/statisticsPaths";
import { PermissionsService } from "../permissions/permissions.service";

@singleton()
export class TrainingsStatisticsService {
    protected rightWords: Word[] = [];
    protected wrongWords: Word[] = [];
    protected skippedWords: Word[] = [];

    constructor(
        protected httpService: HttpService,
        protected extensionPageManager: ExtensionPageManagerService,
        protected userStatistics: UserStatisticsService,
        protected permissions: PermissionsService
    ) {

    }

    public addRightWord(word: Word) {
        if (this.permissions.isSoundEnabled()) {
            TrainingSound.playCorrectSound();
        }

        this.rightWords.push(word);
    }

    public addWrongWord(word: Word) {
        if (this.permissions.isSoundEnabled()) {
            TrainingSound.playIncorrectSound();
        }

        this.wrongWords.push(word);
    }

    public addSkippedWord(word: Word) {
        this.skippedWords.push(word);

        this.addWrongWord(word);
    }

    public getRightWords() {
        return this.rightWords;
    }

    public getWrongWords() {
        return this.wrongWords;
    }

    public getSkippedWords() {
        return this.skippedWords;
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

    public clearAfterInterrupt() {
        this.skippedWords = [];
        this.rightWords = [];
        this.wrongWords = [];
    }

    private updateTrainingStatistics(gameID: number) {
        const accuracyRate = this.rightWords.length / (this.rightWords.length + this.wrongWords.length);

        this.httpService.post(URL.training.finishTraining, {
            accuracyRate,
            trainingName: this.getTrainingName(gameID)
        });

        this.userStatistics.updateStatistics({
            fieldPath: StatisticsPath.LEARNED_WORDS,
            count: this.rightWords.length
        });

        this.userStatistics.updateStatistics({
            fieldPath: StatisticsPath.SKIPPED_WORDS,
            count: this.skippedWords.length
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