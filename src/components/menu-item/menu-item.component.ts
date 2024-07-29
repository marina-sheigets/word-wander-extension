import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './menu-item.component.css';
import { Informer } from "../../services/informer/informer.service";

@injectable()
export class MenuItemComponent extends BaseComponent {
    onItemPress = new Informer<void>();

    constructor() {
        super(styles);

    }

    addItem(title: string, icon: HTMLElement) {
        this.rootElement.addEventListener('mouseup', () => this.onItemPress.inform())

        this.rootElement.append(
            icon,
            title
        );
    }
}