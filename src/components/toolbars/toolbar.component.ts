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
    protected setPositionOnScreen() {
        this.rootElement.style.top = this.localStorage.get(STORAGE_KEYS.PositionTop) || this.initialTopPosition;
        this.rootElement.style.left = this.localStorage.get(STORAGE_KEYS.PositionLeft) || this.initialLeftPosition;
    }
}