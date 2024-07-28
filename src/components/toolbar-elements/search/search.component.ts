import { singleton } from "tsyringe";
import { BaseComponent } from "../../base-component/base-component";
import { ToolbarButtonComponent } from "../../toolbar-button/toolbar-button.component";
import * as styles from './search.component.css'
import { SearchMenuComponent } from "./search-menu/search-menu.component";

@singleton()
export class SearchComponent extends BaseComponent {

    constructor(
        protected button: ToolbarButtonComponent,
        protected menu: SearchMenuComponent
    ) {
        super(styles);

        this.button.addIcon('search');

        this.rootElement.append(
            button.rootElement,
            menu.rootElement
        );

        this.button.onPress.subscribe(this.menu.toggleMenu.bind(this.menu));
    }
}