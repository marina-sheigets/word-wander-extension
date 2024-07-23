import { singleton } from "tsyringe";
import { BaseComponent } from "../../base-component/base-component";
import * as styles from './minimize-button.component.css'
import { IconService } from "../../../services/icon/icon.component";

@singleton()
export class MinimizeButtonComponent extends BaseComponent {

    constructor(
        private iconService: IconService,
    ) {
        super();

        this.applyRootStyle(styles);

        this.rootElement.append(
            this.iconService.init("close_fullscreen")
        );
    }
}