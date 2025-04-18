import { singleton } from "tsyringe";
import { Messages } from "../../constants/messages";
import { MessengerService } from "../messenger/messenger.service";
import { FinishTrainingsMessages, StartTrainingsMessages } from "../../constants/trainingMessages";
import { AudioChallengeTrainingData, ListeningTrainingData, RepeatingTrainingData, WordConstructionTrainingData, WordTranslationTrainingData } from "../../types/TrainingsData";
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
import { TrainingsStatisticsService } from "../trainings-statistics/trainings-statistics.service";
import { PermissionsService } from "../permissions/permissions.service";

@singleton()
export class TrainingsService {
    protected isGameInProgress = false;
    private currentGame: number | null = null;
    private amountWordsForTrainings: AmountWords[] = [];

    constructor(
        protected messenger: MessengerService,
        protected settingsService: SettingsService,
        protected httpService: HttpService,
        protected trainingStatistics: TrainingsStatisticsService,
        protected permissions: PermissionsService
    ) {

        this.messenger.subscribe(Messages.InterruptTraining, () => {
            this.trainingStatistics.clearAfterInterrupt();
            this.interruptTraining();
        });

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

        if (this.permissions.isSoundEnabled()) {
            TrainingSound.playStartTraining();
        }

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

    public async fetchDataForAudioChallengeTraining(): Promise<AudioChallengeTrainingData | null> {
        const words = await this.fetchWordsForTraining(TrainingNames.AudioChallenge);

        if (!words) {
            return null;
        }

        return shuffleWordsForTraining(words, TrainingNames.AudioChallenge);
    }

    public async fetchDataForTranslationWord() {
        const words = await this.fetchWordsForTraining(TrainingNames.TranslationWord);

        if (!words) {
            return null;
        }

        return shuffleWordsForTraining(words, TrainingNames.TranslationWord);
    }

    public async fetchDataForRepeating(): Promise<RepeatingTrainingData | null> {
        const words = await this.fetchWordsForTraining(TrainingNames.Repeating);

        if (!words) {
            return null;
        }

        return shuffleWordsForTraining(words, TrainingNames.Repeating);
    }

    public async fetchDataForWordConstructionTraining(): Promise<WordConstructionTrainingData | null> {
        const words = await this.fetchWordsForTraining(TrainingNames.WordConstructor);

        if (!words) {
            return null;
        }

        return shuffleWordsForTraining(words, TrainingNames.WordConstructor);
    }

    public async fetchDataForListeningTraining(): Promise<ListeningTrainingData | null> {
        const words = await this.fetchWordsForTraining(TrainingNames.Listening);

        if (!words) {
            return null;
        }

        return shuffleWordsForTraining(words, TrainingNames.Listening);
    }

    private interruptTraining() {
        this.messenger.send(FinishTrainingsMessages[this.currentGame || 0]);
        this.isGameInProgress = false;
        this.currentGame = null;

    }
    private finishGame() {
        this.messenger.send(Messages.ShowTrainingStatistics, this.currentGame);
        this.interruptTraining();
    }
}