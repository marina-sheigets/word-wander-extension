import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './word-translation.component.css';
import { IconService } from "../../services/icon/icon.component";

@injectable()
export class WordTranslationComponent extends BaseComponent {
    constructor(
        private iconService: IconService
    ) {
        super(styles);

    }

    addPair(sourceWord: string, targetWord: string) {
        const word = document.createElement('div');
        const translation = document.createElement('div');
        const arrow = document.createElement('div');

        word.textContent = sourceWord;
        translation.textContent = targetWord;
        arrow.append(this.iconService.init('arrow_forward'));

        this.rootElement.append(
            word,
            arrow,
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