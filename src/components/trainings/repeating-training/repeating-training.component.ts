import { singleton } from "tsyringe";
import { Messages } from "../../../constants/messages";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { TrainingsStatisticsService } from "../../../services/trainings-statistics/trainings-statistics.service";
import { TrainingsService } from "../../../services/trainings/trainings.service";
import { HistoryItem } from "../../../types/History";
import { RepeatingTrainingData } from "../../../types/TrainingsData";
import { setAnimationForWrongAnswer } from "../../../utils/setAnimationForWrongAnswer";
import { WordVariantButton } from "../../button/word-variant/word-variant.component";
import { LoaderComponent } from "../../loader/loader.component";
import { GameWrapperPopupComponent } from "../../popups/game-wrapper-popup/game-wrapper-popup.component";
import { TimerComponent } from "../../timer/timer.component";
import { WordCountComponent } from "../../word-count/word-count.component";
import * as styles from './repeating-training.component.css';
import { TextToSpeechService } from "../../../services/text-to-speech/text-to-speech.service";

@singleton()
export class RepeatingTrainingComponent extends GameWrapperPopupComponent {
    private trainingWrapper = document.createElement('div');
    private currentWordElement = document.createElement('div');
    private variantsWrapper = document.createElement('div');
    private content = document.createElement('div');

    private data: RepeatingTrainingData | null = null;
    private currentWordIndex = 0;
    private currentWord: HistoryItem | null = null;

    private timeoutBetweenWords = 1000;


    constructor(
        protected wordCountComponent: WordCountComponent,
        protected timerComponent: TimerComponent,
        protected statistics: TrainingsStatisticsService,
        protected loader: LoaderComponent,
        protected trainingsService: TrainingsService,
        protected textToSpeech: TextToSpeechService,
        protected messenger: MessengerService,
        protected i18n: I18nService
    ) {
        super(i18n, messenger);

        this.setTitle(i18nKeys.RepeatWordsTitle);

        this.trainingWrapper.classList.add(styles.trainingWrapper);
        this.content.classList.add(styles.hidden, styles.content);
        this.currentWordElement.classList.add(styles.currentWord);
        this.variantsWrapper.classList.add(styles.variantsWrapper);

        this.content.append(
            this.wordCountComponent.rootElement,
            this.timerComponent.rootElement,
            this.currentWordElement,
            this.variantsWrapper,
        );

        this.trainingWrapper.append(
            this.content,
            this.loader.rootElement
        );

        this.hide();
        this.setContent(this.trainingWrapper);
        this.loader.show();

        this.timerComponent.onTimerEnd.subscribe(this.switchToNextWord.bind(this));

        this.messenger.subscribe(Messages.StartRepeatingTraining, this.start.bind(this));
        this.messenger.subscribe(Messages.FinishRepeatingTraining, this.interruptTraining.bind(this));
    }

    private async start() {
        this.show();
        this.data = await this.trainingsService.fetchDataForRepeating();
        this.content.classList.remove(styles.hidden);
        this.currentWordIndex = 0;
        this.loader.hide();
        this.setCurrentWord(this.currentWordIndex);
        this.setVariants();
    }

    private setCurrentWord(index: number) {
        if (!this.data) {
            return;
        }

        this.timerComponent.start(5);

        this.currentWord = this.data.translations[index];

        this.currentWordElement.textContent = this.currentWord.translation;
        this.wordCountComponent.setCurrentCount(index + 1);
        this.wordCountComponent.setTotalCount(this.data.translations.length);
    }

    setVariants() {
        if (!this.data) {
            return;
        }

        const variantsForCurrentWord = this.data.variants.find(obj => obj.word === this.currentWord?.translation);

        if (!variantsForCurrentWord) {
            //  this.throwErrorInTraining();
            return;
        }

        this.variantsWrapper.innerHTML = '';
        variantsForCurrentWord.translations.forEach(translation => {
            const variantButton = new WordVariantButton();
            variantButton.rootElement.textContent = translation;
            variantButton.onVariantClick.subscribe((e) => this.handleVariantClick(e.target as HTMLButtonElement));
            this.variantsWrapper.append(variantButton.rootElement);
        });
    }

    private async handleVariantClick(target: HTMLButtonElement) {
        this.currentWordIndex++;

        const isRightAnswer = target.textContent === this.currentWord?.word;

        await this.timerComponent.interrupt(isRightAnswer, this.timeoutBetweenWords);

        if (isRightAnswer) {
            this.statistics.addRightWord(this.currentWord as HistoryItem);
        } else {
            this.statistics.addWrongWord(this.currentWord as HistoryItem);
            await setAnimationForWrongAnswer(target, styles, this.timeoutBetweenWords);
        }

        this.textToSpeech.play(this.currentWord?.word || '');

        if (this.currentWordIndex === this.data?.translations.length) {
            this.hide();
            this.messenger.send(Messages.FinishTraining);
        } else {
            this.setCurrentWord(this.currentWordIndex);
            this.setVariants();
        }
    }

    private switchToNextWord() {
        // simulate pressing on wrong button
        const allButtons = Array.from(this.variantsWrapper.querySelectorAll(':scope > div')) as HTMLButtonElement[];
        const wrongButton = allButtons.find(button => button.textContent !== this.currentWord?.word);
        this.handleVariantClick(wrongButton as HTMLButtonElement);
    }

    private interruptTraining() {
        this.hide();
        this.resetTraining();
    }

    private resetTraining() {
        this.currentWordIndex = 0;
    }
}