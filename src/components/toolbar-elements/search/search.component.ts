import { singleton } from "tsyringe";
import { BaseComponent } from "../../base-component/base-component";
import { ToolbarButtonComponent } from "../../toolbar-button/toolbar-button.component";
import * as styles from './search.component.css'

@singleton()
export class SearchComponent extends BaseComponent {

    constructor(
        protected button: ToolbarButtonComponent
    ) {
        super();

        this.applyRootStyle(styles);

        this.button.addIcon('search');

        this.rootElement.append(
            button.rootElement
        );
    }
}