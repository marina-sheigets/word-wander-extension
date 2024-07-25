import { STORAGE_KEYS } from "../../constants/localStorage-keys";
import { LocalStorageService } from "../../services/localStorage/localStorage.service";
import { BaseComponent } from "../base-component/base-component";

export abstract class Toolbar extends BaseComponent {
    protected readonly initialTopPosition = '50px';
    protected readonly initialLeftPosition = '50px';

    constructor(
        protected localStorage: LocalStorageService
    ) {
        super();

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
}