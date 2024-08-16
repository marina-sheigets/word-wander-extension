import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './button.component.css';
import { Informer } from "../../services/informer/informer.service";
import { IconService } from "../../services/icon/icon.component";
import { I18nService } from "../../services/i18n/i18n.service";
import { i18nKeys } from "../../services/i18n/i18n-keys";

@injectable()
export class ButtonComponent extends BaseComponent {
    button = document.createElement('button');
    onClick = new Informer<string>();

    constructor(
        protected iconService: IconService,
        protected i18n: I18nService,
    ) {
        super(styles);

        this.button.addEventListener('mousedown', () => this.onClick.inform());

        this.rootElement.append(
            this.button
        );

    }

    addButtonIcon(iconName: string) {
        this.button.append(this.iconService.init(iconName));
    }

    addButtonName(key: string) {
        this.i18n.follow(key as i18nKeys, (name: string) => {
            this.button.textContent = name;
        })
    }

    disable() {
        this.button.disabled = true;
        this.rootElement.classList.add(styles.disabled);
    }

    enable() {
        this.button.disabled = false;
        this.rootElement.classList.remove(styles.disabled);
    }

    addTooltip(text: string) {
        this.rootElement.setAttribute('title', text);
    }
}