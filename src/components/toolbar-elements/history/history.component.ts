import { singleton } from "tsyringe";
import { BaseComponent } from "../../base-component/base-component";
import { ToolbarButtonComponent } from "../../toolbar-button/toolbar-button.component";
import * as styles from './history.component.css'

@singleton()
export class HistoryComponent extends BaseComponent {

    constructor(
        protected button: ToolbarButtonComponent
    ) {
        super();

        this.applyRootStyle(styles);

        this.button.addIcon('history');

        this.rootElement.append(
            button.rootElement
        );
    }
}