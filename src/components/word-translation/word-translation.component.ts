import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './word-translation.component.css';
import { IconService } from "../../services/icon/icon.component";
import englishFlag from '../../../assets/flags/flag_809.png';
import ukrainianFlag from '../../../assets/flags/flag_422.png';

@injectable()
export class WordTranslationComponent extends BaseComponent {
    wordFlag = document.createElement('img');
    translationFlag = document.createElement('img');

    word = document.createElement('div');
    translation = document.createElement('div');
    arrow = document.createElement('div');

    constructor(
        private iconService: IconService
    ) {
        super(styles);

        this.wordFlag.src = englishFlag;
        this.wordFlag.width = 35;
        this.translationFlag.src = ukrainianFlag;
        this.translationFlag.width = 35;

        this.rootElement.append(
            this.wordFlag,
            this.word,
            this.arrow,
            this.translationFlag,
            this.translation
        )


    }

    addPair(word: string, translation: string) {
        this.word.textContent = word;
        this.translation.textContent = translation;
        this.arrow.append(this.iconService.init('arrow_forward'))
    }

    show() {
        this.rootElement.classList.remove(styles.hidden);
    }

    hide() {
        this.rootElement.classList.add(styles.hidden);
    }

    clear() {
        this.arrow.innerHTML = '';
        this.translation.textContent = '';
        this.word.textContent = '';
    }
}