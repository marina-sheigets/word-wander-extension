import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './menu-item.component.css';
import { Informer } from "../../services/informer/informer.service";
import { I18nService } from "../../services/i18n/i18n.service";
import { i18nKeys } from "../../services/i18n/i18n-keys";

@injectable()
export class MenuItemComponent extends BaseComponent {
    onItemPress = new Informer<void>();

    constructor(
        protected i18n: I18nService,
    ) {
        super(styles);

    }

    addItem(title: i18nKeys, icon: HTMLElement) {
        this.rootElement.addEventListener('mouseup', () => this.onItemPress.inform())

        const text = document.createElement('span');

        this.i18n.follow(title, (name: string) => {
            text.textContent = name;
        });

        this.rootElement.append(
            icon,
            text
        );
    }

    hide() {
        this.rootElement.classList.add(styles.hidden);
    }

    show() {
        this.rootElement.classList.remove(styles.hidden);
    }
}