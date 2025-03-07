import { injectable } from "tsyringe";
import { i18nKeys } from "../../services/i18n/i18n-keys";
import { I18nService } from "../../services/i18n/i18n.service";
import { BaseComponent } from "../base-component/base-component";
import { ButtonComponent } from "../button/button.component";
import * as styles from "./not-found.component.css";

@injectable()
export class NotFoundComponent extends BaseComponent {
    private title = document.createElement('h1');
    private description = document.createElement('p');


    constructor(
        private button: ButtonComponent,
        protected i18n: I18nService
    ) {
        super(styles);

        this.rootElement.append(
            this.title,
            this.description,
            this.button.rootElement
        );

        this.button.hide();
        this.hide();
    }

    setTitle(key: i18nKeys) {
        this.i18n.follow(key, (value: string) => {
            this.title.textContent = value;
        });
    }

    setDescription(key: i18nKeys) {
        this.i18n.follow(key, (value: string) => {
            this.description.textContent = value;
        });
    }

    setButtonName(key: i18nKeys) {
        this.button.show();
        this.button.addButtonName(key);
    }

    onButtonClick(callback: (value: any) => void) {
        this.button.onClick.subscribe(callback);
    }

    hide() {
        this.rootElement.classList.add(styles.hidden);
    }

    show() {
        this.rootElement.classList.remove(styles.hidden);
    }
}