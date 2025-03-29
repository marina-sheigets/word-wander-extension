import { singleton } from "tsyringe";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { GameWrapperPopupComponent } from "../../popups/game-wrapper-popup/game-wrapper-popup.component";
import * as styles from "./audio-challenge-training.component.css";
import { WordCountComponent } from "../../word-count/word-count.component";
import { LoaderComponent } from "../../loader/loader.component";
import { TrainingsService } from "../../../services/trainings/trainings.service";
import { Messages } from "../../../constants/messages";
import { AudioChallengeTrainingData } from "../../../types/TrainingsData";
import { ProgressBarComponent } from "../../progress-bar/progress-bar.component";
import { WordPlayerComponent } from "../../word-player/word-player.component";
import { WordVariantButton } from "../../button/word-variant/word-variant.component";
import { setAnimationForWrongAnswer } from "../../../utils/setAnimationForWrongAnswer";
import { TrainingsStatisticsService } from "../../../services/trainings-statistics/trainings-statistics.service";
import { SkipWordButtonComponent } from "../../button/skip-word/skip-word-button.component";
import { ComponentsFactory } from "../../factories/component.factory.";
import { Word } from "../../../types/Word";

@singleton()
export class AudioChallengeTrainingComponent extends GameWrapperPopupComponent {
    private trainingWrapper = document.createElement('div');
    private content = document.createElement('div');
    private variantsWrapper = document.createElement('div');


    private data: AudioChallengeTrainingData | null = null;
    private currentWordIndex = 0;
    private currentWord: Word | null = null;

    constructor(
        protected wordCountComponent: WordCountComponent,
        protected wordPlayerComponent: WordPlayerComponent,
        protected progressBar: ProgressBarComponent,
        protected skipWordButton: SkipWordButtonComponent,
        protected loader: LoaderComponent,
        protected statistics: TrainingsStatisticsService,
        protected messenger: MessengerService,
        protected i18n: I18nService,
        protected trainingsService: TrainingsService,
        protected componentsFactory: ComponentsFactory
    ) {
        super(i18n, messenger);

        this.setTitle(i18nKeys.AudioChallengeTitle);

        this.trainingWrapper.classList.add(styles.trainingWrapper);
        this.content.classList.add(styles.hidden, styles.content);
        this.variantsWrapper.classList.add(styles.variantsWrapper);

        this.content.append(
            this.wordCountComponent.rootElement,
            this.wordPlayerComponent.rootElement,
            this.variantsWrapper,
            this.skipWordButton.rootElement,
            this.progressBar.rootElement
        );

        this.trainingWrapper.append(
            this.content,
            this.loader.rootElement,
        );

        this.hide();
        this.setContent(this.trainingWrapper);

        this.skipWordButton.onClick.subscribe(() => this.onWordSkip());

        this.messenger.subscribe(Messages.StartAudioChallengeTraining, this.start.bind(this));
        this.messenger.subscribe(Messages.FinishAudioChallengeTraining, this.interruptTraining.bind(this));
    }

    private async start() {
        this.resetBeforeStart();

        this.show();
        this.data = await this.trainingsService.fetchDataForAudioChallengeTraining();

        if (!this.data) {
            return;
        }

        this.content.classList.remove(styles.hidden);
        this.progressBar.setNumberOfSections(this.data.translations.length);

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
        this.wordPlayerComponent.playWord();
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
            this.statistics.addWrongWord(this.currentWord as Word);
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

    private resetBeforeStart() {
        this.content.classList.add(styles.hidden);
        this.loader.show();
    }

    private interruptTraining() {
        this.hide();
        this.resetTraining();
    }

    private resetTraining() {
        this.currentWordIndex = 0;
        this.progressBar.clear();
    }

    private onWordSkip() {
        this.currentWordIndex++;
        this.progressBar.addWrongSection();
        this.statistics.addWrongWord(this.currentWord as Word);

        if (this.currentWordIndex === this.data?.translations.length) {
            this.hide();
            this.messenger.send(Messages.FinishTraining);
        } else {
            this.setCurrentWord(this.currentWordIndex);
            this.setVariants();
        }
    }
}