import { singleton } from "tsyringe";
import { Messages } from "../../constants/messages";
import { MessengerService } from "../messenger/messenger.service";
import { FinishTrainingsMessages, StartTrainingsMessages } from "../../constants/trainingMessages";
import { AudioChallengeTrainingData, RepeatingTrainingData, WordConstructionTrainingData } from "../../types/TrainingsData";

@singleton()
export class TrainingsService {
    protected isGameInProgress = false;
    private currentGame: number | null = null;

    constructor(
        protected messenger: MessengerService
    ) {

        this.messenger.subscribe(Messages.InterruptTraining, this.interruptTraining.bind(this));
        this.messenger.subscribe(Messages.FinishTraining, this.finishGame.bind(this));
    }

    startGame(gameID: number) {
        this.isGameInProgress = true;
        this.currentGame = gameID;
        this.messenger.send(StartTrainingsMessages[gameID]);
    }

    showCloseTrainingPopup() {
        this.messenger.send(Messages.ShowCloseTrainingPopup, this.currentGame);
    }

    public fetchDataForWordTranslation() {
        setTimeout(() => {


        }, 1000);

        // fetch list of words and translations, mix them up
        return {
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
            variants: [{
                word: "school",
                translations: ["школа", "бібліотека", "магістр", "кохання"]
            },
            {
                word: "university",
                translations: ["школа", "бібліотека", "університет", "кохання"]
            },
            {
                word: "house",
                translations: ["школа", "дім", "університет", "кохання"]
            },
            ]
        }

    }

    public fetchDataForAudioChallengeTraining(): Promise<AudioChallengeTrainingData> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(
                    {
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
                        variants: [{
                            word: "school",
                            translations: ["школа", "бібліотека", "магістр", "кохання"]
                        },
                        {
                            word: "university",
                            translations: ["школа", "бібліотека", "університет", "кохання"]
                        },
                        {
                            word: "house",
                            translations: ["школа", "дім", "університет", "кохання"]
                        },
                        ]
                    }
                );
            }, 1000);
        });
    }

    fetchDataForTranslationWord() {
        setTimeout(() => { }, 1000);

        // fetch list of words and translations, mix them up
        return {
            translations: [
                {
                    word: "school",
                    translation: "школа"
                },
                {
                    word: "university",
                    translation: "університет"
                },
                {
                    word: "book",
                    translation: "книга"
                }
            ],
            variants: [{
                word: "школа",
                translations: ["university", "house", "book", "school"]
            },
            {
                word: "університет",
                translations: ["university", "house", "book", "school"]
            },
            {
                word: "книга",
                translations: ["university", "house", "book", "school"]
            },
            ]
        }
    }

    public fetchDataForRepeating(): Promise<RepeatingTrainingData> {
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
                    variants: [{
                        word: "школа",
                        translations: ["school", "university"]
                    },
                    {
                        word: "університет",
                        translations: ["house", "university"]
                    },
                    {
                        word: "дім",
                        translations: ["school", "house"]
                    },
                    ]
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