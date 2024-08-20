import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './toolbar-button.component.css';
import { Informer } from "../../services/informer/informer.service";
import { ToolbarButtonService } from "../../services/toolbar-button/toolbar-button.service";
import { MessengerService } from "../../services/messenger/messenger.service";
import { Messages } from "../../constants/messages";
import { IconComponent } from "../icon/icon.component";

@injectable()
export class ToolbarButtonComponent extends BaseComponent {
    private isActive = false;
    private iconWrapper = document.createElement('div');
    onPress = new Informer<boolean>();

    constructor(
        protected toolbarButtonService: ToolbarButtonService,
        protected messenger: MessengerService
    ) {
        super(styles);

        this.rootElement.addEventListener('mousedown', this.onToolbarButtonPress.bind(this))
        this.rootElement.append(
            this.iconWrapper
        );

        this.toolbarButtonService.registerButton(this);
    }

    onToolbarButtonPress() {
        this.messenger.send(Messages.CloseAllMenus);

        this.isActive = !this.isActive;
        this.onPress.inform(this.isActive);
    }

    public toggleActive(isActive: boolean) {
        this.isActive = isActive;
        if (this.isActive) {
            this.toolbarButtonService.setAllButtonsInactive();
            this.setActive();
        } else {
            this.unsetActive();
        }
    }

    public addTooltip(tooltip: string) {
        this.iconWrapper.title = tooltip;
    }

    public addIcon(name: string) {
        const newIcon = new IconComponent();
        newIcon.setIcon(name);

        this.iconWrapper.classList.add(styles.iconWrapper);
        this.iconWrapper.append(newIcon.rootElement);
    }

    public setActive() {
        this.iconWrapper.classList.add(styles.active);
    }

    public unsetActive() {
        this.iconWrapper.classList.remove(styles.active);
    }
}