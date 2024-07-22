import { singleton } from "tsyringe";
import { ToolbarLogoComponent } from "../../toolbar-elements/toolbar-logo/toolbar-logo.component";
import * as styles from './minimized-toolbar.component.css';
import { LocalStorageService } from "../../../services/localStorage/localStorage.service";
import { Toolbar } from "../toolbar.component";
@singleton()
export class MinimizedToolbarComponent extends Toolbar {

    constructor(
        private logoComponent: ToolbarLogoComponent,
        protected localStorage: LocalStorageService
    ) {
        super(localStorage);

        this.applyRootStyle(styles);
        this.addClassNamesToComponents(styles);
        this.setPositionOnScreen();

        this.rootElement.append(
            this.logoComponent.rootElement
        );
    }

}