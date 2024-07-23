import { singleton } from "tsyringe";
import { Toolbar } from "../toolbar.component";
import { LocalStorageService } from "../../../services/localStorage/localStorage.service";
import * as styles from './draggable-toolbar.component.css';
import { ToolbarLogoComponent } from "../../toolbar-elements/toolbar-logo/toolbar-logo.component";
import { SearchComponent } from "../../toolbar-elements/search/search.component";

@singleton()
export class DraggableToolbarComponent extends Toolbar {

    constructor(
        protected search: SearchComponent,
        private logoComponent: ToolbarLogoComponent,
        protected localStorage: LocalStorageService
    ) {
        super(localStorage);

        this.applyRootStyle(styles);
        this.setPositionOnScreen();

        this.logoComponent.rootElement.classList.add(styles.logo);

        this.rootElement.append(
            this.logoComponent.rootElement,
            this.search.rootElement
        );
    }
}