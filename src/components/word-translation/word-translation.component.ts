import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './word-translation.component.css';
import { IconComponent } from "../icon/icon.component";
import { IconName } from "../../types/IconName";

@injectable()
export class WordTranslationComponent extends BaseComponent {
    constructor(
        private arrowIcon: IconComponent
    ) {
        super(styles);

    }

    addPair(sourceWord: string, targetWord: string, isArrowVisible: boolean = true) {
        const word = document.createElement('div');
        const translation = document.createElement('div');
        const arrow = document.createElement('div');

        word.textContent = sourceWord;
        translation.textContent = targetWord;

        this.arrowIcon.setIcon(IconName.Arrow);

        arrow.append(this.arrowIcon.rootElement);

        this.rootElement.append(word);

        if (isArrowVisible) {
            this.rootElement.append(arrow);
        }

        this.rootElement.append(translation);

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