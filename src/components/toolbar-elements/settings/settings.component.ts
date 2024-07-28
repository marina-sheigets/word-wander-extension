import { singleton } from "tsyringe";
import { BaseComponent } from "../../base-component/base-component";
import { ToolbarButtonComponent } from "../../toolbar-button/toolbar-button.component";
import * as styles from './settings.component.css'
import { SettingsMenuComponent } from "./settings-menu/settings-menu.component";

@singleton()
export class SettingsComponent extends BaseComponent {

    constructor(
        protected button: ToolbarButtonComponent,
        protected menu: SettingsMenuComponent
    ) {
        super(styles);

        this.button.addIcon('settings');

        this.rootElement.append(
            button.rootElement,
            this.menu.rootElement
        );

        this.button.onPress.subscribe(this.menu.toggleMenu.bind(this.menu))
    }
}