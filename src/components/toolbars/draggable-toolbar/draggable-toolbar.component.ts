import { singleton } from "tsyringe";
import { Toolbar } from "../toolbar.component";
import { LocalStorageService } from "../../../services/localStorage/localStorage.service";
import * as styles from './draggable-toolbar.component.css';
import { ToolbarLogoComponent } from "../../toolbar-elements/toolbar-logo/toolbar-logo.component";
import { SearchComponent } from "../../toolbar-elements/search/search.component";
import { HistoryComponent } from "../../toolbar-elements/history/history.component";
import { PlayerComponent } from "../../toolbar-elements/player/player.component";
import { SettingsComponent } from "../../toolbar-elements/settings/settings.component";
import { TOOLBAR_MODE, ToolbarService } from "../../../services/toolbar/toolbar.service";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { ToolbarBlockLayerComponent } from "../../toolbar-block-layer/toolbar-block-layer.component";
import { LearnComponent } from "../../toolbar-elements/learn/learn.component";
import { SaveAsAudioFileComponent } from "../../toolbar-elements/save-audio-file/save-audio-file.component";

@singleton()
export class DraggableToolbarComponent extends Toolbar {
    mode = TOOLBAR_MODE.DRAGGABLE;
    constructor(
        private logoComponent: ToolbarLogoComponent,
        protected learn: LearnComponent,
        protected search: SearchComponent,
        protected history: HistoryComponent,
        protected player: PlayerComponent,
        protected saveAsAudioFile: SaveAsAudioFileComponent,
        protected settings: SettingsComponent,
        protected localStorage: LocalStorageService,
        protected toolbarService: ToolbarService,
        protected messenger: MessengerService,
        protected toolbarBlockLayer: ToolbarBlockLayerComponent,
    ) {
        super(localStorage, toolbarService);

        this.applyRootStyle(styles);

        this.rootElement.append(
            this.logoComponent.rootElement,
            this.search.rootElement,
            this.history.rootElement,
            this.player.rootElement,
            this.saveAsAudioFile.rootElement,
            this.learn.rootElement,
            this.settings.rootElement,
            this.toolbarBlockLayer.rootElement,
        );

        this.initializeToolbar();
    }

}