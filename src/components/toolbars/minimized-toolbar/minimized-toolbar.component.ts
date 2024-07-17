import { singleton } from "tsyringe";
import { BaseComponent } from "../../base-component/base-component";
import { ToolbarLogoComponent } from "../../toolbar-elements/toolbar-logo/toolbar-logo.component";
import * as styles from './minimized-toolbar.component.css';
import { LocalStorageService } from "../../../services/localStorage/localStorage.service";
import { STORAGE_KEYS } from "../../../constants/localStorage-keys";
@singleton()
export class MinimizedToolbarComponent extends BaseComponent {
    protected readonly initialTopPosition = '50px';
    protected readonly initialLeftPosition = '50px';

    constructor(
        private logoComponent: ToolbarLogoComponent,
        private localStorage: LocalStorageService
    ) {
        super();
        this.applyRootStyle(styles);
        this.addClassNamesToComponents(styles);
        this.setPositionOnScreen();

        this.rootElement.append(
            this.logoComponent.rootElement
        );
    }


    protected setPositionOnScreen() {
        this.rootElement.style.top = this.localStorage.get(STORAGE_KEYS.PositionTop) || this.initialTopPosition;
        this.rootElement.style.left = this.localStorage.get(STORAGE_KEYS.PositionLeft) || this.initialLeftPosition;
    }
}