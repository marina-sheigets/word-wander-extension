import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './menu.component.css';

@injectable()
export class MenuComponent extends BaseComponent {
    constructor() {
        super(styles);

        this.hide = this.hide.bind(this);
        this.open = this.open.bind(this);

        this.hide();
    }


    hide() {
        this.rootElement.classList.add(styles.hidden);
    }

    open() {
        this.rootElement.classList.remove(styles.hidden);
    }

    toggleMenu(isActive: boolean) {
        if (isActive) {
            this.open();
        } else {
            this.hide()
        }
    }
}