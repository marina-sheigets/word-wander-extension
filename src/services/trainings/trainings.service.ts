import { singleton } from "tsyringe";
import { Messages } from "../../constants/messages";
import { MessengerService } from "../messenger/messenger.service";

@singleton()
export class TrainingsService {
    private MESSAGES_FOR_START_TRAINING: { [key: number]: Messages } = {
        1: Messages.StartWordTranslationTraining
    }
    protected isGameInProgress = false;
    private currentGame: number | null = null;

    constructor(
        protected messenger: MessengerService
    ) {


        this.messenger.subscribe(Messages.FinishTraining, this.finishGame.bind(this));
    }

    startGame(gameID: number) {
        this.isGameInProgress = true;
        this.currentGame = gameID;
        this.messenger.send(this.MESSAGES_FOR_START_TRAINING[gameID]);
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

    private finishGame() {
        this.isGameInProgress = false;
        this.currentGame = null;

        this.messenger.send(Messages.ShowTrainingStatistics, { gameID: this.currentGame });
    }
}