import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './word-count.component.css';

@injectable()
export class WordCountComponent extends BaseComponent {
    private currentWordCount = document.createElement('p');
    private totalWordCount = document.createElement('p');
    private divider = document.createElement('p');

    constructor() {
        super(styles);

        this.divider.textContent = '/';
        this.rootElement.append(
            this.currentWordCount,
            this.divider,
            this.totalWordCount
        );
    }

    setTotalCount(count: number) {
        this.totalWordCount.textContent = count.toString();
    }
    setCurrentCount(count: number) {
        this.currentWordCount.textContent = count.toString();
    }
}