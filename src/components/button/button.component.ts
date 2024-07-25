import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './button.component.css';
import { Informer } from "../../services/informer/informer.service";
import { IconService } from "../../services/icon/icon.component";

@injectable()
export class ButtonComponent extends BaseComponent {
    button = document.createElement('button');
    onClick = new Informer<string>();

    constructor(
        protected iconService: IconService
    ) {
        super();

        this.applyRootStyle(styles);

        this.button.addEventListener('mousedown', () => this.onClick.inform.bind(this));

        this.rootElement.append(
            this.button
        );

    }

    addButtonIcon(iconName: string) {
        this.button.append(this.iconService.init(iconName));
    }

    addButtonName(name: string) {
        this.button.textContent = name;
    }

    disable() {
        this.button.disabled = true;
        this.rootElement.classList.add(styles.disabled);
    }

    enable() {
        this.button.disabled = false;
        this.rootElement.classList.remove(styles.disabled);
    }
}