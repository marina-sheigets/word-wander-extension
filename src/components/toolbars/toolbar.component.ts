import { STORAGE_KEYS } from "../../constants/localStorage-keys";
import { LocalStorageService } from "../../services/localStorage/localStorage.service";
import { TOOLBAR_MODE, ToolbarService } from "../../services/toolbar/toolbar.service";
import { dragElement } from "../../utils/dragElement";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './toolbar.component.css';
export abstract class Toolbar extends BaseComponent {
    protected readonly initialTopPosition = '50px';
    protected readonly initialLeftPosition = '50px';
    abstract mode: TOOLBAR_MODE;

    constructor(
        protected localStorage: LocalStorageService,
        protected toolbarService: ToolbarService,
    ) {
        super();

        this.applyRootStyle(styles);
        this.setPositionOnScreen();

        this.toolbarService.onModeChange.subscribe(this.toggleDisplayToolbar.bind(this));

        this.rootElement.addEventListener('mousedown', this.onMouseDown.bind(this))

    }
    protected setPositionOnScreen(top?: string, left?: string) {
        if (top && left) {
            this.localStorage.set(STORAGE_KEYS.PositionTop, top);
            this.localStorage.set(STORAGE_KEYS.PositionLeft, left);

            this.rootElement.style.top = top;
            this.rootElement.style.left = left;
        } else {
            this.rootElement.style.top = this.localStorage.get(STORAGE_KEYS.PositionTop) || this.initialTopPosition;
            this.rootElement.style.left = this.localStorage.get(STORAGE_KEYS.PositionLeft) || this.initialLeftPosition;
        }
    }

    toggleDisplayToolbar(currentMode: TOOLBAR_MODE) {
        if (currentMode !== this.mode) {
            this.hide();
        } else {
            this.show();
        }
    }

    async onMouseDown(e: MouseEvent) {
        // const target: any = e.target;

        // if (target && target.closest(".rootClassName__toolbar-button__word-wander")) {
        //     return;
        // }
        e.preventDefault();

        this.rootElement.classList.add(styles.draggable);

        await dragElement(e, this.rootElement);

        this.rootElement.classList.remove(styles.draggable);

        this.setPositionOnScreen(this.rootElement.style.top, this.rootElement.style.left);
    }

    hide() {
        this.rootElement.classList.add(styles.hidden);
    }

    show() {
        this.rootElement.classList.remove(styles.hidden);
    }
}