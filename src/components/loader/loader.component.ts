import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './loader.component.css';
@injectable()
export class LoaderComponent extends BaseComponent {
    loader = document.createElement('div');

    constructor() {
        super(styles);

        this.loader.classList.add(styles.loader);
        this.rootElement.append(
            this.loader
        );

        this.hide();
    }

    show() {
        this.rootElement.classList.remove(styles.hidden);
    }

    hide() {
        this.rootElement.classList.add(styles.hidden);
    }
}