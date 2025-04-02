import { singleton } from "tsyringe";
import { Messages } from "../../../constants/messages";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { TrainingsService } from "../../../services/trainings/trainings.service";
import { WordConstructionTrainingData } from "../../../types/TrainingsData";
import { LoaderComponent } from "../../loader/loader.component";
import { GameWrapperPopupComponent } from "../../popups/game-wrapper-popup/game-wrapper-popup.component";
import { WordConstructorComponent } from "../../word-constructor/word-constructor.component";
import { WordCountComponent } from "../../word-count/word-count.component";
import { WordPlayerComponent } from "../../word-player/word-player.component";
import * as styles from "./listening-training.component.css";
import { SkipWordButtonComponent } from "../../button/skip-word/skip-word-button.component";
import { TrainingsStatisticsService } from "../../../services/trainings-statistics/trainings-statistics.service";
import { Word } from "../../../types/Word";

@singleton()
export class ListeningTrainingComponent extends GameWrapperPopupComponent {
    private trainingWrapper = document.createElement('div');
    private content = document.createElement('div');


    private data: WordConstructionTrainingData | null = null;
    private currentWordIndex = 0;
    private currentWord: Word | null = null;

    constructor(
        protected wordConstructorComponent: WordConstructorComponent,
        protected wordPlayerComponent: WordPlayerComponent,
        protected loader: LoaderComponent,
        protected wordCountComponent: WordCountComponent,
        protected skipWordButton: SkipWordButtonComponent,
        protected messenger: MessengerService,
        protected i18n: I18nService,
        protected trainingsService: TrainingsService,
        protected statistics: TrainingsStatisticsService
    ) {
        super(i18n, messenger);

        this.setTitle(i18nKeys.ListeningTitle);

        this.trainingWrapper.classList.add(styles.trainingWrapper);
        this.content.classList.add(styles.hidden, styles.content);

        this.content.append(
            this.wordCountComponent.rootElement,
            this.wordPlayerComponent.rootElement,
            this.wordConstructorComponent.rootElement,
            this.skipWordButton.rootElement,
        );

        this.trainingWrapper.append(
            this.content,
            this.loader.rootElement,
        );

        this.hide();
        this.setContent(this.trainingWrapper);

        this.wordConstructorComponent.onLettersFinished.subscribe((isWordCorrect) => this.onLettersFinished(isWordCorrect));
        this.skipWordButton.onClick.subscribe(() => this.onWordSkip());

        this.messenger.subscribe(Messages.StartListeningTraining, this.start.bind(this));
        this.messenger.subscribe(Messages.FinishListeningTraining, this.interruptTraining.bind(this));
    }

    private async start() {
        this.resetBeforeStart();

        this.show();
        this.data = await this.trainingsService.fetchDataForListeningTraining();

        if (!this.data) {
            return;
        }

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

    private onLettersFinished(isWordCorrect: boolean, isSkipped: boolean = false) {
        if (isWordCorrect) {
            this.statistics.addRightWord(this.currentWord as Word);
        } else if (!isSkipped) {
            this.statistics.addWrongWord(this.currentWord as Word)
        }

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

    private onWordSkip() {
        this.skipWordButton.hide();
        this.wordConstructorComponent.autocompleteWord();

        this.statistics.addSkippedWord(this.currentWord as Word);

        setTimeout(() => {
            this.onLettersFinished(false, true);
            this.skipWordButton.show();
        }, 1000);

    }
}