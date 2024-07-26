import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './word-meaning.component.css';

@injectable()
export class WordMeaningComponent extends BaseComponent {
    header = document.createElement('h3');
    meaningParagraph = document.createElement('p');

    constructor() {
        super();

        this.applyRootStyle(styles);

        this.header.textContent = 'Meaning';

        this.rootElement.append(
            this.header,
            this.meaningParagraph
        )

        this.hide();
    }

    addMeaning(text: string) {
        this.meaningParagraph.textContent = text;
    }

    clear() {
        this.meaningParagraph.textContent = '';
    }

    show() {
        this.rootElement.classList.remove(styles.hidden);
    }

    hide() {
        this.rootElement.classList.add(styles.hidden);
    }
}