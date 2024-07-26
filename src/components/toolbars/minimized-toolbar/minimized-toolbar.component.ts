import { singleton } from "tsyringe";
import { ToolbarLogoComponent } from "../../toolbar-elements/toolbar-logo/toolbar-logo.component";
import * as styles from './minimized-toolbar.component.css';
import { LocalStorageService } from "../../../services/localStorage/localStorage.service";
import { Toolbar } from "../toolbar.component";
import { TOOLBAR_MODE, ToolbarService } from "../../../services/toolbar/toolbar.service";
@singleton()
export class MinimizedToolbarComponent extends Toolbar {
    mode = TOOLBAR_MODE.MINIMIZED;

    constructor(
        private logoComponent: ToolbarLogoComponent,
        protected localStorage: LocalStorageService,
        protected toolbarService: ToolbarService

    ) {
        super(localStorage, toolbarService);

        this.applyRootStyle(styles);

        this.logoComponent.rootElement.addEventListener('mouseup', this.setDraggable.bind(this));
        this.rootElement.append(
            this.logoComponent.rootElement
        );

        this.initializeToolbar();
    }

    setDraggable() {
        this.toolbarService.setToolbarMode(TOOLBAR_MODE.DRAGGABLE);
    }

}