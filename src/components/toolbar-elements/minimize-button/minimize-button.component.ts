import { singleton } from "tsyringe";
import { BaseComponent } from "../../base-component/base-component";
import * as styles from './minimize-button.component.css'
import { IconService } from "../../../services/icon/icon.component";
import { TOOLBAR_MODE, ToolbarService } from "../../../services/toolbar/toolbar.service";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { Messages } from "../../../constants/messages";
import { ToolbarButtonService } from "../../../services/toolbar-button/toolbar-button.service";

@singleton()
export class MinimizeButtonComponent extends BaseComponent {

    constructor(
        private iconService: IconService,
        private toolbarService: ToolbarService,
        private toolbarButtonService: ToolbarButtonService,
        private messenger: MessengerService
    ) {
        super(styles);

        this.rootElement.append(
            this.iconService.init("close_fullscreen")
        );

        this.rootElement.addEventListener('mousedown', this.onMinimize.bind(this));
        this.rootElement.title = 'Minimize';
    }

    onMinimize() {
        this.messenger.send(Messages.CloseAllMenus);
        this.toolbarButtonService.setAllButtonsInactive();
        this.toolbarService.setToolbarMode(TOOLBAR_MODE.MINIMIZED);
    }
}