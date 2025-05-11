import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import { Collection } from "../../types/Collection";
import * as styles from './collections-label.component.css';

@injectable()
export class CollectionsLabelComponent extends BaseComponent {

    constructor() {
        super(styles);
    }

    setCollections(collections: Collection[], symbolsLimit = 40) {
        this.rootElement.textContent = '';

        if (!collections.length) {
            this.rootElement.textContent = "Default"
        } else {
            collections.forEach((collection, i) => {
                if (i + 1 === collections.length) {
                    this.rootElement.textContent += collection.name + '';
                } else {
                    this.rootElement.textContent += collection.name + ', ';
                }
            });
        }

        this.addTooltip();

        if (
            this.rootElement.textContent &&
            this.rootElement.textContent.length > symbolsLimit
        ) {
            this.rootElement.textContent = this.rootElement.textContent.slice(0, symbolsLimit - 3) + '...';
        }
    }

    private addTooltip() {
        this.rootElement.title = this.rootElement.textContent || '';
    }
}