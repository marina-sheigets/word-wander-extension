import { singleton } from "tsyringe";
import { Messages } from "../../../constants/messages";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { TrainingsService } from "../../../services/trainings/trainings.service";
import { HistoryItem } from "../../../types/History";
import { WordConstructionTrainingData } from "../../../types/TrainingsData";
import { LoaderComponent } from "../../loader/loader.component";
import { GameWrapperPopupComponent } from "../../popups/game-wrapper-popup/game-wrapper-popup.component";
import { WordConstructorComponent } from "../../word-constructor/word-constructor.component";
import { WordCountComponent } from "../../word-count/word-count.component";
import { WordPlayerComponent } from "../../word-player/word-player.component";
import * as styles from "./listening-training.component.css";

@singleton()
export class ListeningTrainingComponent extends GameWrapperPopupComponent {
    private trainingWrapper = document.createElement('div');
    private content = document.createElement('div');


    private data: WordConstructionTrainingData | null = null;
    private currentWordIndex = 0;
    private currentWord: HistoryItem | null = null;

    constructor(
        protected wordConstructorComponent: WordConstructorComponent,
        protected wordPlayerComponent: WordPlayerComponent,
        protected loader: LoaderComponent,
        protected wordCountComponent: WordCountComponent,
        protected messenger: MessengerService,
        protected i18n: I18nService,
        protected trainingsService: TrainingsService,
    ) {
        super(i18n, messenger);

        this.setTitle(i18nKeys.ListeningTitle);

        this.trainingWrapper.classList.add(styles.trainingWrapper);
        this.content.classList.add(styles.hidden, styles.content);

        this.content.append(
            this.wordCountComponent.rootElement,
            this.wordPlayerComponent.rootElement,
            this.wordConstructorComponent.rootElement,
        );

        this.trainingWrapper.append(
            this.content,
            this.loader.rootElement,
        );

        this.hide();
        this.setContent(this.trainingWrapper);

        this.wordConstructorComponent.onLettersFinished.subscribe(() => this.onLettersFinished());

        this.messenger.subscribe(Messages.StartListeningTraining, this.start.bind(this));
        this.messenger.subscribe(Messages.FinishListeningTraining, this.interruptTraining.bind(this));
    }

    private async start() {
        this.resetBeforeStart();

        this.show();
        this.data = await this.trainingsService.fetchDataForListeningTraining();
        this.content.classList.remove(styles.hidden);
        this.setCurrentWord(this.currentWordIndex);
        this.setVariants();
        this.loader.hide();
    }

    private setCurrentWord(index: number) {
        if (!this.data) {
            return;
        }

        this.currentWord = this.data.translations[index];
        this.wordPlayerComponent.setWord(this.currentWord.word);
        this.wordCountComponent.setCurrentCount(index + 1);
        this.wordCountComponent.setTotalCount(this.data.translations.length);
    }

    private setVariants() {
        if (!this.data || !this.currentWord) {
            return;
        }

        this.wordConstructorComponent.init(this.currentWord.word);
        this.wordPlayerComponent.playWord();
    }

    private onLettersFinished() {
        this.currentWordIndex++;

        if (this.data && this.currentWordIndex === this.data.translations.length) {
            this.hide();
            this.messenger.send(Messages.FinishTraining);
        } else {
            this.setCurrentWord(this.currentWordIndex);
            this.setVariants();
        }
    }

    private interruptTraining() {
        this.hide();
        this.resetTraining();
    }

    private resetTraining() {
        this.currentWordIndex = 0;
    }

    private resetBeforeStart() {
        this.content.classList.add(styles.hidden);
        this.loader.show();
        this.wordConstructorComponent.clear();
    }
}