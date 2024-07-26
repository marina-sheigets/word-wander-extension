import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './synonyms.component.css'
@injectable()
export class SynonymsComponent extends BaseComponent {
    header = document.createElement('h3');
    synonymsList = document.createElement('ul');

    constructor() {
        super();

        this.applyRootStyle(styles);

        this.header.textContent = 'Synonyms';
        this.synonymsList.classList.add(styles.examples);

        this.rootElement.append(
            this.header,
            this.synonymsList
        );

        this.hide();
    }

    addSynonyms(list: string[]) {
        list.forEach((item) => {
            const li = document.createElement('li');
            li.textContent = item;
            this.synonymsList.append(li);
        })
    }

    clear() {
        this.synonymsList.innerHTML = '';
    }

    show() {
        this.rootElement.classList.remove(styles.hidden);
    }

    hide() {
        this.rootElement.classList.add(styles.hidden);
    }
}