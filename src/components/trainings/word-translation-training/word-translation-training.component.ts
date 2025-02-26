import { singleton } from "tsyringe";
import * as styles from './word-translation-training.component.css';
import { TrainingsService } from "../../../services/trainings/trainings.service";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { WordCountComponent } from "../../word-count/word-count.component";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { Messages } from "../../../constants/messages";
import { WordTranslationTrainingData } from "../../../types/TrainingsData";
import { LoaderComponent } from "../../loader/loader.component";
import { I18nService } from "../../../services/i18n/i18n.service";
import { HistoryItem } from "../../../types/History";
import { WordVariantButton } from "../../button/word-variant/word-variant.component";
import { TrainingsStatisticsService } from "../../../services/trainings-statistics/trainings-statistics.service";
import { ProgressBarComponent } from "../../progress-bar/progress-bar.component";
import { GameWrapperPopupComponent } from "../../popups/game-wrapper-popup/game-wrapper-popup.component";
import { setAnimationForWrongAnswer } from "../../../utils/setAnimationForWrongAnswer";
import { TextToSpeechService } from "../../../services/text-to-speech/text-to-speech.service";
import { ComponentsFactory } from "../../factories/component.factory.";

@singleton()
export class WordTranslationTrainingComponent extends GameWrapperPopupComponent {
    private trainingWrapper = document.createElement('div');
    private currentWordElement = document.createElement('div');
    private variantsWrapper = document.createElement('div');
    private content = document.createElement('div');

    private data: WordTranslationTrainingData | null = null;
    private currentWordIndex = 0;
    private currentWord: HistoryItem | null = null;

    constructor(
        protected wordCountComponent: WordCountComponent,
        protected progressBar: ProgressBarComponent,
        protected statistics: TrainingsStatisticsService,
        protected loader: LoaderComponent,
        protected trainingsService: TrainingsService,
        protected messenger: MessengerService,
        protected textToSpeech: TextToSpeechService,
        protected i18n: I18nService,
        protected componentsFactory: ComponentsFactory
    ) {
        super(i18n, messenger);

        this.setTitle(i18nKeys.WordTranslationTitle);

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

        this.messenger.subscribe(Messages.StartWordTranslationTraining, this.start.bind(this));
        this.messenger.subscribe(Messages.FinishWordTranslationTraining, this.interruptTraining.bind(this));
    }

    private async start() {
        this.show();
        this.data = await this.trainingsService.fetchDataForWordTranslation();
        this.content.classList.remove(styles.hidden);
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

        this.textToSpeech.play(this.currentWord.word);

        this.currentWordElement.textContent = this.currentWord.word;
        this.wordCountComponent.setCurrentCount(index + 1);
        this.wordCountComponent.setTotalCount(this.data.translations.length);
    }

    setVariants() {
        if (!this.data) {
            return;
        }

        const variantsForCurrentWord = this.data.variants.find(obj => obj.word === this.currentWord?.word);

        if (!variantsForCurrentWord) {
            //  this.throwErrorInTraining();
            return;
        }

        this.variantsWrapper.innerHTML = '';
        variantsForCurrentWord.translations.forEach(translation => {
            const variantButton = this.componentsFactory.createComponent(WordVariantButton);
            variantButton.rootElement.textContent = translation;
            variantButton.onVariantClick.subscribe(this.handleVariantClick.bind(this));
            this.variantsWrapper.append(variantButton.rootElement);
        });
    }
    private async handleVariantClick(e: Event) {
        const target = e.target as HTMLButtonElement;

        this.currentWordIndex++;

        if (target.textContent === this.currentWord?.translation) {
            this.statistics.addRightWord(this.currentWord);
            this.progressBar.addCorrectSection();
        } else {
            this.progressBar.addWrongSection();
            this.statistics.addWrongWord(this.currentWord as HistoryItem);
            await setAnimationForWrongAnswer(target, styles);
        }

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