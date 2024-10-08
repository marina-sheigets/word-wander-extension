import { singleton } from "tsyringe";
import { BaseComponent } from "../../base-component/base-component";
import { ToolbarButtonComponent } from "../../toolbar-button/toolbar-button.component";
import * as styles from './history.component.css'
import { HistoryMenuComponent } from "./history-menu/history-menu.component";
import { IconName } from "../../../types/IconName";
import { i18nKeys } from "../../../services/i18n/i18n-keys";

@singleton()
export class HistoryComponent extends BaseComponent {

    constructor(
        protected button: ToolbarButtonComponent,
        protected menu: HistoryMenuComponent
    ) {
        super(styles);

        this.button.addIcon(IconName.History);
        this.button.addTooltip(i18nKeys.History);

        this.menu.setContent();

        this.rootElement.append(
            button.rootElement,
            menu.rootElement
        );

        this.button.onPress.subscribe((isActive) => {
            this.menu.toggleMenu(isActive);
            if (isActive) {
                this.menu.setContent();
            }
        });
    }
}