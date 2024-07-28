import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './word-usage.component.css'

@injectable()
export class WordUsageComponent extends BaseComponent {
    header = document.createElement('h3');
    examplesList = document.createElement('ul');

    constructor() {
        super(styles);

        this.header.textContent = 'Usage';
        this.examplesList.classList.add(styles.examples);

        this.rootElement.append(
            this.header,
            this.examplesList
        );

        this.hide();
    }

    addExamples(list: string[]) {
        list.forEach((item) => {
            const li = document.createElement('li');
            li.textContent = item;
            this.examplesList.append(li);
        })
    }

    clear() {
        this.examplesList.innerHTML = '';
    }

    show() {
        this.rootElement.classList.remove(styles.hidden);
    }

    hide() {
        this.rootElement.classList.add(styles.hidden);
    }
}