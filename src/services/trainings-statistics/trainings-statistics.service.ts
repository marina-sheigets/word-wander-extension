import { singleton } from "tsyringe";
import { TrainingSound } from "../training-sound/training-sound.service";
import { trainings } from "../../constants/trainings";
import { HttpService } from "../http/http.service";
import { URL } from "../../constants/urls";
import { Word } from "../../types/Word";

@singleton()
export class TrainingsStatisticsService {
    protected rightWords: Word[] = [];
    protected wrongWords: Word[] = [];

    constructor(
        protected httpService: HttpService
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
        //this.removeRightWordsFromTraining(gameID);

        this.rightWords = [];
        this.wrongWords = [];
    }

    // private removeRightWordsFromTraining(gameID: number) {
    //     const trainingName = trainings.find((training) => training.id === gameID)?.name;

    //     const rightWordsIds = this.rightWords.map((word) => word._id);

    //     this.httpService.delete(URL.training.deleteWordsFromTraining,
    //         {
    //             trainingName: trainingName,
    //         },
    //         {
    //             params: {
    //                 wordsIds: rightWordsIds
    //             }
    //         });
    // }
}