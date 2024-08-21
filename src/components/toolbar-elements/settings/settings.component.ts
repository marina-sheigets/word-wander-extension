import { singleton } from "tsyringe";
import { BaseComponent } from "../../base-component/base-component";
import { ToolbarButtonComponent } from "../../toolbar-button/toolbar-button.component";
import * as styles from './settings.component.css'
import { SettingsMenuComponent } from "./settings-menu/settings-menu.component";
import { IconName } from "../../../types/IconName";
import { i18nKeys } from "../../../services/i18n/i18n-keys";

@singleton()
export class SettingsComponent extends BaseComponent {

    constructor(
        protected button: ToolbarButtonComponent,
        protected menu: SettingsMenuComponent
    ) {
        super(styles);

        this.button.addIcon(IconName.Settings);
        this.button.addTooltip(i18nKeys.Settings);

        this.rootElement.append(
            button.rootElement,
            this.menu.rootElement
        );

        this.button.onPress.subscribe((isActive: boolean) => {
            this.menu.toggleMenu(isActive);
            this.button.toggleActive(isActive);
        })
    }
}