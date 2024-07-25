import { singleton } from "tsyringe";
import { Toolbar } from "../toolbar.component";
import { LocalStorageService } from "../../../services/localStorage/localStorage.service";
import * as styles from './draggable-toolbar.component.css';
import { ToolbarLogoComponent } from "../../toolbar-elements/toolbar-logo/toolbar-logo.component";
import { SearchComponent } from "../../toolbar-elements/search/search.component";
import { HistoryComponent } from "../../toolbar-elements/history/history.component";
import { PlayerComponent } from "../../toolbar-elements/player/player.component";
import { SettingsComponent } from "../../toolbar-elements/settings/settings.component";
import { MinimizeButtonComponent } from "../../toolbar-elements/minimize-button/minimize-button.component";
import { dragElement } from "../../../utils/dragElement";

@singleton()
export class DraggableToolbarComponent extends Toolbar {

    constructor(
        private logoComponent: ToolbarLogoComponent,
        protected search: SearchComponent,
        protected history: HistoryComponent,
        private player: PlayerComponent,
        private settings: SettingsComponent,
        private minimize: MinimizeButtonComponent,
        protected localStorage: LocalStorageService
    ) {
        super(localStorage);

        this.applyRootStyle(styles);
        this.setPositionOnScreen();

        this.logoComponent.rootElement.classList.add(styles.logo);

        this.rootElement.append(
            this.logoComponent.rootElement,
            this.search.rootElement,
            this.history.rootElement,
            this.player.rootElement,
            this.settings.rootElement,
            this.minimize.rootElement
        );

        this.rootElement.addEventListener('mousedown', this.onMouseDown.bind(this))
    }

    async onMouseDown(e: MouseEvent) {
        e.preventDefault();

        this.rootElement.classList.add(styles.draggable);

        await dragElement(e, this.rootElement);

        this.rootElement.classList.remove(styles.draggable);

        this.setPositionOnScreen(this.rootElement.style.top, this.rootElement.style.left);
    }
}