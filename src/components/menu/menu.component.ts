import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './menu.component.css';

@injectable()
export class MenuComponent extends BaseComponent {
    constructor() {
        super();

        this.applyRootStyle(styles);

        this.hide();
    }


    hide() {
        this.rootElement.classList.add(styles.hidden);
    }

    open() {
        this.rootElement.classList.remove(styles.hidden);
    }
}