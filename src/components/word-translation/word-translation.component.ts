import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './word-translation.component.css';
import { IconService } from "../../services/icon/icon.component";
import englishFlag from '../../../assets/flags/flag_809.png';
import ukrainianFlag from '../../../assets/flags/flag_422.png';

@injectable()
export class WordTranslationComponent extends BaseComponent {
    constructor(
        private iconService: IconService
    ) {
        super(styles);

    }

    addPair(sourceWord: string, targetWord: string) {
        const wordFlag = document.createElement('img');
        const translationFlag = document.createElement('img');
        const word = document.createElement('div');
        const translation = document.createElement('div');
        const arrow = document.createElement('div');

        wordFlag.src = englishFlag;
        wordFlag.width = 35;
        translationFlag.src = ukrainianFlag;
        translationFlag.width = 35;

        word.textContent = sourceWord;
        translation.textContent = targetWord;
        arrow.append(this.iconService.init('arrow_forward'));

        this.rootElement.append(wordFlag,
            word,
            arrow,
            translationFlag,
            translation
        );

        this.show();
    }

    show() {
        this.rootElement.classList.remove(styles.hidden);
    }

    hide() {
        this.rootElement.classList.add(styles.hidden);
    }

    clear() {
        this.rootElement.innerHTML = '';
    }
}