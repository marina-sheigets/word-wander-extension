import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './button.component.css';
import { Informer } from "../../services/informer/informer.service";
import { I18nService } from "../../services/i18n/i18n.service";
import { i18nKeys } from "../../services/i18n/i18n-keys";
import { IconComponent } from "../icon/icon.component";

@injectable()
export class ButtonComponent extends BaseComponent {
    buttonIconWrapper = document.createElement('div');
    buttonLabel = document.createElement('span');
    button = document.createElement('button');
    onClick = new Informer<any>();

    constructor(
        protected i18n: I18nService,
    ) {
        super(styles);

        this.button.addEventListener('mousedown', (e: Event) => this.onClick.inform(e));
        this.button.append(this.buttonIconWrapper, this.buttonLabel);
        this.rootElement.append(
            this.button
        );
    }

    addButtonValue(value: string) {
        this.button.value = value;
    }

    addButtonIcon(iconName: string) {
        const icon = new IconComponent();
        icon.setIcon(iconName);

        this.buttonIconWrapper.append(icon.rootElement);
    }

    addButtonName(key: i18nKeys) {
        this.i18n.follow(key, (name: string) => {
            this.buttonLabel.textContent = name;
        });
    }

    disable() {
        this.button.disabled = true;
        this.rootElement.classList.add(styles.disabled);
    }

    enable() {
        this.button.disabled = false;
        this.rootElement.classList.remove(styles.disabled);
    }

    addTooltip(key: i18nKeys) {
        this.i18n.follow(key, (value) => {
            this.rootElement.setAttribute('title', value);
        });
    }
}