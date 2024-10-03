import { singleton } from "tsyringe";
import { Messages } from "../../constants/messages";
import { MessengerService } from "../messenger/messenger.service";
import { FinishTrainingsMessages, StartTrainingsMessages } from "../../constants/trainingMessages";

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
        setTimeout(() => { }, 1000);

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
                    translation: "дом"
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