import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './toolbar-button.component.css';
import { Informer } from "../../services/informer/informer.service";
import { MessengerService } from "../../services/messenger/messenger.service";
import { Messages } from "../../constants/messages";
import { IconComponent } from "../icon/icon.component";
import { I18nService } from "../../services/i18n/i18n.service";
import { i18nKeys } from "../../services/i18n/i18n-keys";
import { IconName } from "../../types/IconName";
import { ComponentsFactory } from "../factories/component.factory.";

@injectable()
export class ToolbarButtonComponent extends BaseComponent {
    private isActive = false;
    private iconWrapper = document.createElement('div');
    onPress = new Informer<boolean>();

    constructor(
        protected messenger: MessengerService,
        protected i18n: I18nService,
        protected componentsFactory: ComponentsFactory

    ) {
        super(styles);

        this.rootElement.addEventListener('mouseup', this.onToolbarButtonPress.bind(this))
        this.rootElement.append(
            this.iconWrapper
        );
    }

    onToolbarButtonPress() {
        this.messenger.send(Messages.CloseAllMenus);

        this.isActive = !this.isActive;
        this.onPress.inform(this.isActive);
    }

    public addTooltip(key: i18nKeys) {
        this.i18n.follow(key, (value) => {
            this.iconWrapper.title = value;
        });
    }

    public addIcon(name: IconName) {
        const newIcon = this.componentsFactory.createComponent(IconComponent);
        newIcon.setIcon(name);

        this.iconWrapper.classList.add(styles.iconWrapper);
        this.iconWrapper.append(newIcon.rootElement);
    }
}