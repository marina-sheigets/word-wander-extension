import { singleton } from "tsyringe";
import { MenuComponent } from "../../../menu/menu.component";
import * as styles from './settings-menu.component.css';
import { MenuItemComponent } from "../../../menu-item/menu-item.component";
import { IconService } from "../../../../services/icon/icon.component";
import { MessengerService } from "../../../../services/messenger/messenger.service";
import { Messages } from "../../../../constants/messages";


@singleton()
export class SettingsMenuComponent extends MenuComponent {
    constructor(
        private openSettingsItem: MenuItemComponent,
        private supportItem: MenuItemComponent,
        private downloadManualItem: MenuItemComponent,
        private iconService: IconService,
        protected messenger: MessengerService
    ) {
        super();

        this.applyRootStyle(styles);

        this.addOpenSettingsItem();
        this.addSupportItem();
        this.addDownloadManualItem();

        this.rootElement.append(
            this.openSettingsItem.rootElement,
            this.supportItem.rootElement,
            this.downloadManualItem.rootElement
        );

        this.rootElement.addEventListener('mouseup', this.hide)
    }

    private addOpenSettingsItem() {
        const openSettingsIcon = this.iconService.init('manufacturing');
        this.openSettingsItem.addItem('Open settings', openSettingsIcon);

        this.openSettingsItem.onItemPress.subscribe(() => {
            this.messenger.send(Messages.OpenSettings);
        });
    }

    private addSupportItem() {
        const supportIcon = this.iconService.init('info');
        this.supportItem.addItem('Support', supportIcon);

        this.supportItem.onItemPress.subscribe(() => {
            console.log("supportItem");
        });
    }

    private addDownloadManualItem() {
        const downloadManualIcon = this.iconService.init('download');
        this.downloadManualItem.addItem('Download manual', downloadManualIcon);

        this.downloadManualItem.onItemPress.subscribe(() => {
            console.log("downloadManualItem");
        });

    }
}