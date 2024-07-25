import { singleton } from "tsyringe";
import { MenuComponent } from "../../../menu/menu.component";
import * as styles from './search-menu.component.css';
import { InputComponent } from "../../../input/input.component";
import { ButtonComponent } from "../../../button/button.component";

@singleton()
export class SearchMenuComponent extends MenuComponent {
    searchContainer = document.createElement('div');

    constructor(
        private inputComponent: InputComponent,
        private button: ButtonComponent
    ) {
        super();

        this.applyRootStyle(styles);

        this.button.addButtonName('');
        this.button.addButtonIcon('search');

        this.inputComponent.setInputSettings('text', 'Type something...');
        this.inputComponent.onChange.subscribe(this.onSearch);
        this.button.onClick.subscribe(() => this.onSearch(this.inputComponent.input.value))

        this.searchContainer.classList.add(styles.searchContainer);

        this.searchContainer.append(
            this.inputComponent.rootElement,
            this.button.rootElement
        )
        this.rootElement.append(
            this.searchContainer
        );
    }

    private onSearch(value: string) {
        if (value.trim().length === 0) {
            return;
        }


        // search  word using API
    }
}