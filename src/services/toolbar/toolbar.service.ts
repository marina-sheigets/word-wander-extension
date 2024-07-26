import { singleton } from "tsyringe";
import { Informer } from "../informer/informer.service";
import { LocalStorageService } from "../localStorage/localStorage.service";
import { STORAGE_KEYS } from "../../constants/localStorage-keys";

export const enum TOOLBAR_MODE {
    DRAGGABLE = "DRAGGABLE",
    MINIMIZED = "MINIMIZED"
}

@singleton()
export class ToolbarService {
    private defaultMode = TOOLBAR_MODE.DRAGGABLE;
    onModeChange = new Informer<TOOLBAR_MODE>();
    mode: TOOLBAR_MODE = this.defaultMode;
    constructor(
        private localStorage: LocalStorageService
    ) {
        this.mode = this.localStorage.get(STORAGE_KEYS.Mode) as TOOLBAR_MODE || this.defaultMode;
    }

    setToolbarMode(mode?: TOOLBAR_MODE) {
        const selectedMode = mode || this.localStorage.get(STORAGE_KEYS.Mode) as TOOLBAR_MODE || this.defaultMode;

        this.mode = selectedMode;
        this.localStorage.set(STORAGE_KEYS.Mode, this.mode);
        this.onModeChange.inform(this.mode);
    }

    getMode() {
        return this.mode;
    }
}