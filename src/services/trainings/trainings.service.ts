import { singleton } from "tsyringe";
import { Messages } from "../../constants/messages";
import { MessengerService } from "../messenger/messenger.service";
import { FinishTrainingsMessages, StartTrainingsMessages } from "../../constants/trainingMessages";
import { AudioChallengeTrainingData, RepeatingTrainingData, WordConstructionTrainingData, WordTranslationTrainingData } from "../../types/TrainingsData";
import { AmountWords } from "../../types/AmountWords";
import { SettingsService } from "../settings/settings.service";
import { SettingsNames } from "../../constants/settingsNames";
import { HttpService } from "../http/http.service";
import { URL } from "../../constants/urls";
import { trainings } from "../../constants/trainings";
import { BackgroundMessages } from "../../constants/backgroundMessages";
import { TrainingSound } from "../training-sound/training-sound.service";
import { TrainingNames } from "../../constants/trainingNames";
import { shuffleWordsForTraining } from "../../utils/shuffleWordsForTraining";
import { Word } from "../../types/Word";

@singleton()
export class TrainingsService {
    protected isGameInProgress = false;
    private currentGame: number | null = null;
    private amountWordsForTrainings: AmountWords[] = [];

    constructor(
        protected messenger: MessengerService,
        protected settingsService: SettingsService,
        protected httpService: HttpService,
    ) {

        this.messenger.subscribe(Messages.InterruptTraining, this.interruptTraining.bind(this));
        this.messenger.subscribe(Messages.FinishTraining, this.finishGame.bind(this));

        this.settingsService.subscribe(SettingsNames.User, this.fetchAmountOfWords.bind(this));

        chrome.runtime?.onMessage.addListener(async (request) => {
            if (request.message === BackgroundMessages.DictionarySync) {
                this.fetchAmountOfWords();
            }
        });
    }

    startGame(gameID: number) {
        this.isGameInProgress = true;
        this.currentGame = gameID;
        TrainingSound.playStartTraining();
        this.messenger.send(StartTrainingsMessages[gameID]);
    }

    showCloseTrainingPopup() {
        this.messenger.send(Messages.ShowCloseTrainingPopup, this.currentGame);
    }

    private fetchAmountOfWords() {
        this.httpService.get(URL.training.getAmountWordsForTrainings)?.then((res) => {
            if (res && res.data) {
                this.amountWordsForTrainings = res.data;
            }
        })
            .finally(() => {
                this.messenger.send(Messages.InitTrainingsList);
            })

    }

    public getAmountOfWordsForTraining(name: string): number {
        return this.amountWordsForTrainings.find((amount) => amount.training === name)?.amountOfWords || 0;
    }

    public areEnoughWordsForTraining(gameID: number): boolean {
        const selectedTrainingName = trainings.find((training) => training.id === gameID)!.name;
        const amountOfWords = this.getAmountOfWordsForTraining(selectedTrainingName);
        const minimumAmountOfWords = trainings.find((training) => training.name === selectedTrainingName)?.minimumAmountOfWords || 0;

        if (!selectedTrainingName) {
            return false;
        }

        return amountOfWords >= minimumAmountOfWords;
    }

    private fetchWordsForTraining(trainingName: TrainingNames): Promise<Word[] | null> {
        const request = this.httpService.get(URL.training.getWordsForTraining + `?trainingName=${trainingName}`);

        if (!request) {
            return Promise.resolve(null);
        }

        return request.then((res) => {
            if (res && res.data) {
                return res.data.words as Word[];
            }
            return null;
        }).catch((err) => {
            console.error(err);
            return null;
        })
    }


    public async fetchDataForWordTranslation(): Promise<WordTranslationTrainingData | null> {
        const words = await this.fetchWordsForTraining(TrainingNames.WordTranslation);

        if (!words) {
            return null;
        }

        return shuffleWordsForTraining(words, TrainingNames.WordTranslation);

    }

    public fetchDataForAudioChallengeTraining(): Promise<AudioChallengeTrainingData> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(
                    {
                        translations: [],
                        variants: []
                        // translations: [
                        //     {
                        //         word: "school",
                        //         translation: 'школа'
                        //     },
                        //     {
                        //         word: "university",
                        //         translation: 'університет'
                        //     },
                        //     {
                        //         word: "house",
                        //         translation: "дім"
                        //     }
                        // ],
                        // variants: [{
                        //     word: "school",
                        //     translations: ["школа", "бібліотека", "магістр", "кохання"]
                        // },
                        // {
                        //     word: "university",
                        //     translations: ["школа", "бібліотека", "університет", "кохання"]
                        // },
                        // {
                        //     word: "house",
                        //     translations: ["школа", "дім", "університет", "кохання"]
                        // },
                        // ]
                    }
                );
            }, 1000);
        });
    }

    fetchDataForTranslationWord() {
        setTimeout(() => { }, 1000);

        // fetch list of words and translations, mix them up
        return {
            translations: [],
            variants: []
            // translations: [
            //     {
            //         word: "school",
            //         translation: "школа"
            //     },
            //     {
            //         word: "university",
            //         translation: "університет"
            //     },
            //     {
            //         word: "book",
            //         translation: "книга"
            //     }
            // ],
            // variants: [{
            //     word: "школа",
            //     translations: ["university", "house", "book", "school"]
            // },
            // {
            //     word: "університет",
            //     translations: ["university", "house", "book", "school"]
            // },
            // {
            //     word: "книга",
            //     translations: ["university", "house", "book", "school"]
            // },
            // ]
        }
    }

    public fetchDataForRepeating(): Promise<RepeatingTrainingData> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    translations: [],
                    variants: []
                    // translations: [
                    //     {
                    //         word: "school",
                    //         translation: 'школа'
                    //     },
                    //     {
                    //         word: "university",
                    //         translation: 'університет'
                    //     },
                    //     {
                    //         word: "house",
                    //         translation: "дім"
                    //     }
                    // ],
                    // variants: [{
                    //     word: "школа",
                    //     translations: ["school", "university"]
                    // },
                    // {
                    //     word: "університет",
                    //     translations: ["house", "university"]
                    // },
                    // {
                    //     word: "дім",
                    //     translations: ["school", "house"]
                    // },
                    // ]
                });
            }, 1000);
        });
    }


    public fetchDataForWordConstructionTraining(): Promise<WordConstructionTrainingData> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    translations: [
                        {
                            word: "school",
                            translation: 'школа'
                        },
                        {
                            word: "university",
                            translation: 'університет'
                        },
                        {
                            word: "house",
                            translation: "дім"
                        }
                    ],

                });
            }, 1000);
        });
    }

    public fetchDataForListeningTraining(): Promise<WordConstructionTrainingData> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    translations: [
                        {
                            word: "school",
                            translation: 'школа'
                        },
                        {
                            word: "university",
                            translation: 'університет'
                        },
                        {
                            word: "house",
                            translation: "дім"
                        }
                    ],

                });
            }, 1000);
        });
    }

    private interruptTraining() {
        this.messenger.send(FinishTrainingsMessages[this.currentGame || 0]);
        this.isGameInProgress = false;
        this.currentGame = null;

    }
    private finishGame() {
        this.interruptTraining();
        this.messenger.send(Messages.ShowTrainingStatistics, { gameID: this.currentGame });
    }
}