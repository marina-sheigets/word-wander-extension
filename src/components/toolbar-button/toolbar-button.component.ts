import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './toolbar-button.component.css';
import { IconService } from "../../services/icon/icon.component";
import { Informer } from "../../services/informer/informer.service";

@injectable()
export class ToolbarButtonComponent extends BaseComponent {
    private isActive = false;
    private iconWrapper = document.createElement('div');
    onPress = new Informer<boolean>();

    constructor(
        protected iconService: IconService
    ) {
        super();

        this.applyRootStyle(styles);

        this.rootElement.addEventListener('mousedown', this.onToolbarButtonPress.bind(this))
        this.rootElement.append(
            this.iconWrapper
        );

    }

    onToolbarButtonPress() {
        this.isActive = !this.isActive;
        this.onPress.inform(this.isActive);

        if (this.isActive) {
            this.setActive();
        } else {
            this.unsetActive();
        }
    }

    public addTooltip(tooltip: string) {
        this.iconWrapper.title = tooltip;
    }

    public addIcon(name: string) {
        this.iconWrapper.classList.add(styles.iconWrapper);
        this.iconWrapper.append(this.iconService.init(name));
    }

    public setActive() {
        this.iconWrapper.classList.add(styles.active);
    }

    public unsetActive() {
        this.iconWrapper.classList.remove(styles.active);
    }
}