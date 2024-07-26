import { singleton } from "tsyringe";
import { MenuComponent } from "../../../menu/menu.component";
import * as styles from './search-menu.component.css';
import { InputComponent } from "../../../input/input.component";
import { ButtonComponent } from "../../../button/button.component";
import { SearchService } from "../../../../services/search/search.service";
import { LoaderComponent } from "../../../loader/loader.component";
import { SearchContentComponent } from "../search-content/search-content.component";

@singleton()
export class SearchMenuComponent extends MenuComponent {
    searchContainer = document.createElement('div');
    emptyContainer = document.createElement('div');
    content = document.createElement('div');

    constructor(
        private inputComponent: InputComponent,
        private button: ButtonComponent,
        private searchService: SearchService,
        private loader: LoaderComponent,
        private searchContent: SearchContentComponent
    ) {
        super();

        this.applyRootStyle(styles);

        this.button.addButtonName('');
        this.button.addButtonIcon('search');

        this.inputComponent.setInputSettings('text', 'Type something...');
        this.inputComponent.onChange.subscribe(this.onSearch.bind(this));
        this.button.onClick.subscribe(() => {
            this.onSearch(this.inputComponent.input.value)
        })

        this.searchContainer.classList.add(styles.searchContainer);
        this.emptyContainer.classList.add(styles.emptyContainer);
        this.content.classList.add(styles.content);

        this.emptyContainer.textContent = 'No results...';

        this.searchContainer.append(
            this.inputComponent.rootElement,
            this.button.rootElement
        )

        this.content.append(
            this.emptyContainer,
            this.loader.rootElement,
            this.searchContent.rootElement
        )
        this.rootElement.append(
            this.searchContainer,
            this.content
        );
    }

    private async onSearch(value: string) {
        if (value.trim().length === 0) {
            return;
        }

        this.searchContent.clearData()

        this.searchContent.hide();
        this.loader.show();
        this.button.disable();
        this.inputComponent.setDisabled();
        this.emptyContainer.classList.add(styles.hidden);

        const result: any = await this.searchService.searchWord(value);

        this.loader.hide();
        this.button.enable();
        this.inputComponent.setEnabled();

        if (result) {
            this.inputComponent.clear();
            this.searchContent.fillWithData(value, result);

            this.searchContent.show();
        } else {
            this.emptyContainer.textContent = "Something went wrong. Try again..."
            this.emptyContainer.classList.remove(styles.hidden);
        }
    }

}