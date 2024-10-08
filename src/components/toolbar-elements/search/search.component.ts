import { singleton } from "tsyringe";
import { BaseComponent } from "../../base-component/base-component";
import { ToolbarButtonComponent } from "../../toolbar-button/toolbar-button.component";
import * as styles from './search.component.css'
import { SearchMenuComponent } from "./search-menu/search-menu.component";
import { TextManagerService } from "../../../services/text-manager/text-manager.service";
import { IconName } from "../../../types/IconName";
import { i18nKeys } from "../../../services/i18n/i18n-keys";

@singleton()
export class SearchComponent extends BaseComponent {

    constructor(
        protected button: ToolbarButtonComponent,
        protected menu: SearchMenuComponent,
        protected textManager: TextManagerService
    ) {
        super(styles);

        this.button.addIcon(IconName.Search);
        this.button.addTooltip(i18nKeys.Search);

        this.rootElement.append(
            button.rootElement,
            menu.rootElement
        );

        this.button.onPress.subscribe((isActive: boolean) => {
            this.menu.toggleMenu(isActive);
            this.processSearch(isActive);
        });
    }

    processSearch(isActive: boolean) {
        if (!isActive) return;

        const selectedText = this.textManager.getSelectedTextOnPage();

        if (!selectedText) return;

        this.menu.setAutomaticSearch(selectedText);
    }
}