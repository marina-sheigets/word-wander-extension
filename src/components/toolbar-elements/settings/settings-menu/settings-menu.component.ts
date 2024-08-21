import { singleton } from "tsyringe";
import { MenuComponent } from "../../../menu/menu.component";
import * as styles from './settings-menu.component.css';
import { MenuItemComponent } from "../../../menu-item/menu-item.component";
import { MessengerService } from "../../../../services/messenger/messenger.service";
import { Messages } from "../../../../constants/messages";
import { IconComponent } from "../../../icon/icon.component";
import { i18nKeys } from "../../../../services/i18n/i18n-keys";


@singleton()
export class SettingsMenuComponent extends MenuComponent {
    constructor(
        private openSettingsItem: MenuItemComponent,
        private reportItem: MenuItemComponent,
        private downloadManualItem: MenuItemComponent,
        private infoIcon: IconComponent,
        private downloadIcon: IconComponent,
        private manufacturingIcon: IconComponent,
        protected messenger: MessengerService
    ) {
        super();

        this.applyRootStyle(styles);

        this.addOpenSettingsItem();
        this.addReportItem();
        this.addDownloadManualItem();

        this.rootElement.append(
            this.openSettingsItem.rootElement,
            this.reportItem.rootElement,
            this.downloadManualItem.rootElement
        );

        this.rootElement.addEventListener('mouseup', this.hide)

        this.messenger.subscribe(Messages.CloseAllMenus, this.hide.bind(this));
    }

    private addOpenSettingsItem() {
        this.manufacturingIcon.setIcon('manufacturing');
        this.openSettingsItem.addItem(i18nKeys.OpenSettings, this.manufacturingIcon.rootElement);

        this.openSettingsItem.onItemPress.subscribe(() => {
            this.messenger.send(Messages.OpenSettings);
        });
    }

    private addReportItem() {
        this.infoIcon.setIcon('info');
        this.reportItem.addItem(i18nKeys.Report, this.infoIcon.rootElement);

        this.reportItem.onItemPress.subscribe(() => {
            this.messenger.send(Messages.OpenReportPopup);
        });
    }

    private addDownloadManualItem() {
        this.downloadIcon.setIcon('download');
        this.downloadManualItem.addItem(i18nKeys.DownloadManual, this.downloadIcon.rootElement);

        this.downloadManualItem.onItemPress.subscribe(() => {
            console.log("downloadManualItem");
        });

    }
}