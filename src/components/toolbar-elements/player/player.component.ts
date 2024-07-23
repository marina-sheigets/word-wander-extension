import { singleton } from "tsyringe";
import { BaseComponent } from "../../base-component/base-component";
import { ToolbarButtonComponent } from "../../toolbar-button/toolbar-button.component";
import * as styles from './player.component.css'

@singleton()
export class PlayerComponent extends BaseComponent {

    constructor(
        protected button: ToolbarButtonComponent
    ) {
        super();

        this.applyRootStyle(styles);

        this.button.addIcon('play_circle');

        this.rootElement.append(
            button.rootElement
        );
    }
}