import { singleton } from "tsyringe";
import { BaseComponent } from "../../../base-component/base-component";
import { ToolbarButtonComponent } from "../../../toolbar-button/toolbar-button.component";
import * as styles from './search.component.css'

@singleton()
export class SearchComponent extends BaseComponent {

    constructor(
        protected button: ToolbarButtonComponent
    ) {
        super();

        this.applyRootStyle(styles);
        this.addClassNamesToComponents(styles);

        this.addSearchIcon();

        this.rootElement.append(
            button.rootElement
        );
    }

    addSearchIcon() {
        const searchIcon = document.createElement('span');
        searchIcon.classList.add('material-icons');
        searchIcon.textContent = 'face';

        this.button.addIcon(searchIcon);
    }
}