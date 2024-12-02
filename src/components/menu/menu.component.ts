import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './menu.component.css';

@injectable()
export class MenuComponent extends BaseComponent {
    private innerMouseDownEvent: MouseEvent | null = null;

    constructor() {
        super(styles);

        this.hide = this.hide.bind(this);
        this.open = this.open.bind(this);

        this.rootElement.addEventListener("mouseup", (e) => { e.stopImmediatePropagation(), true });
        this.rootElement.addEventListener("mousedown", this.onMouseDown.bind(this))

        this.hide();
    }


    hide() {
        this.rootElement.classList.add(styles.hidden);
        document.removeEventListener('mousedown', this.onDocumentMouseDown);
    }

    open() {
        document.addEventListener('mousedown', this.onDocumentMouseDown);
        this.rootElement.classList.remove(styles.hidden);
    }

    toggleMenu(isActive: boolean) {
        if (isActive) {
            this.open();
        } else {
            this.hide()
        }
    }

    protected onMouseDown(event: MouseEvent) {
        if (!this.rootElement.classList.contains(styles.hidden)) {
            this.innerMouseDownEvent = event;
        }
    }

    private onDocumentMouseDown = () => {
        if (this.innerMouseDownEvent === null) {
            this.hide();
        }

        this.innerMouseDownEvent = null;
    }
}