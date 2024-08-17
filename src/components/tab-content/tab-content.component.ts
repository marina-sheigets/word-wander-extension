import { i18nKeys } from "../../services/i18n/i18n-keys";
import { I18nService } from "../../services/i18n/i18n.service";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './tab-content.component.css';

export abstract class TabContent extends BaseComponent {
    private title = document.createElement('h2');
    private content = document.createElement('div');
    constructor(
        protected i18n: I18nService
    ) {
        super();
        this.applyRootStyle(styles);

        this.rootElement.append(
            this.title,
            this.content
        );
    }

    setTitle(key: i18nKeys) {
        this.i18n.follow(key, (text) => {
            this.title.textContent = text;
        });
    }


    setContent(...elements: HTMLElement[]) {
        this.content.append(...elements);
    }
}