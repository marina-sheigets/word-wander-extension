import { singleton } from "tsyringe";
import { BaseComponent } from "../../base-component/base-component";
import { ToolbarButtonComponent } from "../../toolbar-button/toolbar-button.component";
import * as styles from './settings.component.css'

@singleton()
export class SettingsComponent extends BaseComponent {

    constructor(
        protected button: ToolbarButtonComponent
    ) {
        super();

        this.applyRootStyle(styles);

        this.button.addIcon('settings');

        this.rootElement.append(
            button.rootElement
        );
    }
}