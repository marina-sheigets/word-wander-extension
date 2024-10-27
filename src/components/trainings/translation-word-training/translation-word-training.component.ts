import { singleton } from "tsyringe";
import { Messages } from "../../../constants/messages";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { TrainingsStatisticsService } from "../../../services/trainings-statistics/trainings-statistics.service";
import { TrainingsService } from "../../../services/trainings/trainings.service";
import { HistoryItem } from "../../../types/History";
import { TranslationWordTrainingData } from "../../../types/TrainingsData";
import { setAnimationForWrongAnswer } from "../../../utils/setAnimationForWrongAnswer";
import { WordVariantButton } from "../../button/word-variant/word-variant.component";
import { LoaderComponent } from "../../loader/loader.component";
import { GameWrapperPopupComponent } from "../../popups/game-wrapper-popup/game-wrapper-popup.component";
import { ProgressBarComponent } from "../../progress-bar/progress-bar.component";
import { WordCountComponent } from "../../word-count/word-count.component";
import * as styles from './translation-word-training.component.css';
import { TextToSpeechService } from "../../../services/text-to-speech/text-to-speech.service";

@singleton()
export class TranslationWordTrainingComponent extends GameWrapperPopupComponent {
    private trainingWrapper = document.createElement('div');
    private currentWordElement = document.createElement('div');
    private variantsWrapper = document.createElement('div');
    private content = document.createElement('div');

    private data: TranslationWordTrainingData | null = null;
    private currentWordIndex = 0;
    private currentWord: HistoryItem | null = null;

    constructor(
        protected wordCountComponent: WordCountComponent,
        protected progressBar: ProgressBarComponent,
        protected statistics: TrainingsStatisticsService,
        protected loader: LoaderComponent,
        protected trainingsService: TrainingsService,
        protected textToSpeech: TextToSpeechService,
        protected messenger: MessengerService,
        protected i18n: I18nService
    ) {
        super(i18n, messenger);

        this.setTitle(i18nKeys.TranslationWordTitle);

        this.trainingWrapper.classList.add(styles.trainingWrapper);
        this.content.classList.add(styles.hidden, styles.content);
        this.currentWordElement.classList.add(styles.currentWord);
        this.variantsWrapper.classList.add(styles.variantsWrapper);

        this.content.append(
            this.wordCountComponent.rootElement,
            this.currentWordElement,
            this.variantsWrapper,
            this.progressBar.rootElement
        );

        this.trainingWrapper.append(
            this.content,
            this.loader.rootElement
        );

        this.hide();
        this.setContent(this.trainingWrapper);
        this.loader.show();

        this.messenger.subscribe(Messages.StartTranslationWordTraining, this.start.bind(this));
        this.messenger.subscribe(Messages.FinishTranslationWordTraining, this.interruptTraining.bind(this));
    }

    private async start() {
        this.show();
        this.data = await this.trainingsService.fetchDataForTranslationWord();
        this.content.classList.remove(styles.hidden);
        this.currentWordIndex = 0;
        this.loader.hide();
        this.progressBar.setNumberOfSections(this.data.translations.length);
        this.setCurrentWord(this.currentWordIndex);
        this.setVariants();
    }

    setCurrentWord(index: number) {
        if (!this.data) {
            return;
        }

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
        variantsForCurrentWord.translations.forEach(word => {
            const variantButton = new WordVariantButton();
            variantButton.rootElement.textContent = word;
            variantButton.onVariantClick.subscribe(this.handleVariantClick.bind(this));
            this.variantsWrapper.append(variantButton.rootElement);
        });
    }

    private async handleVariantClick(e: Event) {
        const target = e.target as HTMLButtonElement;

        this.currentWordIndex++;

        if (target.textContent === this.currentWord?.word) {
            this.statistics.addRightWord(this.currentWord);
            this.progressBar.addCorrectSection();
        } else {
            this.progressBar.addWrongSection();
            this.statistics.addWrongWord(this.currentWord as HistoryItem);
            await setAnimationForWrongAnswer(target, styles);
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

    private interruptTraining() {
        this.hide();
        this.resetTraining();
    }

    private resetTraining() {
        this.currentWordIndex = 0;
        this.progressBar.clear();
    }
}