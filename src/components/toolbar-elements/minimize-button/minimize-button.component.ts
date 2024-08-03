import { singleton } from "tsyringe";
import { BaseComponent } from "../../base-component/base-component";
import * as styles from './minimize-button.component.css'
import { IconService } from "../../../services/icon/icon.component";
import { TOOLBAR_MODE, ToolbarService } from "../../../services/toolbar/toolbar.service";

@singleton()
export class MinimizeButtonComponent extends BaseComponent {

    constructor(
        private iconService: IconService,
        private toolbarService: ToolbarService
    ) {
        super(styles);

        this.rootElement.append(
            this.iconService.init("close_fullscreen")
        );

        this.rootElement.addEventListener('mousedown', this.onMinimize.bind(this));
        this.rootElement.title = 'Minimize';
    }

    onMinimize() {
        this.toolbarService.setToolbarMode(TOOLBAR_MODE.MINIMIZED);
    }
}