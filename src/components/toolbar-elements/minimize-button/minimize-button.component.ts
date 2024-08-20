import { singleton } from "tsyringe";
import { BaseComponent } from "../../base-component/base-component";
import * as styles from './minimize-button.component.css'
import { TOOLBAR_MODE, ToolbarService } from "../../../services/toolbar/toolbar.service";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { Messages } from "../../../constants/messages";
import { ToolbarButtonService } from "../../../services/toolbar-button/toolbar-button.service";
import { IconComponent } from "../../icon/icon.component";

@singleton()
export class MinimizeButtonComponent extends BaseComponent {

    constructor(
        private icon: IconComponent,
        private toolbarService: ToolbarService,
        private toolbarButtonService: ToolbarButtonService,
        private messenger: MessengerService
    ) {
        super(styles);

        this.icon.setIcon('close_fullscreen');
        this.rootElement.append(this.icon.rootElement);

        this.rootElement.addEventListener('mousedown', this.onMinimize.bind(this));
        this.rootElement.title = 'Minimize';
    }

    onMinimize() {
        this.messenger.send(Messages.CloseAllMenus);
        this.toolbarButtonService.setAllButtonsInactive();
        this.toolbarService.setToolbarMode(TOOLBAR_MODE.MINIMIZED);
    }
}