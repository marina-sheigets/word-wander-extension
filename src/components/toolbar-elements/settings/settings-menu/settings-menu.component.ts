import { singleton } from "tsyringe";
import { MenuComponent } from "../../../menu/menu.component";
import * as styles from './settings-menu.component.css';
import { MenuItemComponent } from "../../../menu-item/menu-item.component";
import { MessengerService } from "../../../../services/messenger/messenger.service";
import { Messages } from "../../../../constants/messages";
import { IconComponent } from "../../../icon/icon.component";
import { i18nKeys } from "../../../../services/i18n/i18n-keys";
import { IconName } from "../../../../types/IconName";


@singleton()
export class SettingsMenuComponent extends MenuComponent {
    constructor(
        private signInItem: MenuItemComponent,
        private openSettingsItem: MenuItemComponent,
        private reportItem: MenuItemComponent,
        private downloadManualItem: MenuItemComponent,
        private signOutItem: MenuItemComponent,
        private signInIcon: IconComponent,
        private infoIcon: IconComponent,
        private downloadIcon: IconComponent,
        private manufacturingIcon: IconComponent,
        private signOutIcon: IconComponent,
        protected messenger: MessengerService
    ) {
        super();

        this.applyRootStyle(styles);

        this.addSingInItem();
        this.addOpenSettingsItem();
        this.addReportItem();
        this.addDownloadManualItem();
        this.addSignOutItem();

        this.rootElement.append(
            this.signInItem.rootElement,
            this.openSettingsItem.rootElement,
            this.reportItem.rootElement,
            this.downloadManualItem.rootElement,
            this.signOutItem.rootElement
        );

        this.rootElement.addEventListener('mouseup', this.hide)

        this.messenger.subscribe(Messages.CloseAllMenus, this.hide.bind(this));

        this.messenger.subscribe(Messages.UserAuthorized, (isAuthorized: boolean) => {
            this.handleItemsVisibility(isAuthorized);
        });
    }

    private addSingInItem() {
        this.signInIcon.setIcon(IconName.SignIn);
        this.signInItem.addItem(i18nKeys.SignIn, this.signInIcon.rootElement);

        this.signInItem.onItemPress.subscribe(() => {
            this.messenger.send(Messages.OpenSignInPopup);
        });
    }

    private addOpenSettingsItem() {
        this.manufacturingIcon.setIcon(IconName.Manufacturing);
        this.openSettingsItem.addItem(i18nKeys.OpenSettings, this.manufacturingIcon.rootElement);

        this.openSettingsItem.onItemPress.subscribe(() => {
            this.messenger.send(Messages.OpenSettings);
        });
    }

    private addReportItem() {
        this.infoIcon.setIcon(IconName.Info);
        this.reportItem.addItem(i18nKeys.Report, this.infoIcon.rootElement);

        this.reportItem.onItemPress.subscribe(() => {
            this.messenger.send(Messages.OpenReportPopup);
        });
    }

    private addDownloadManualItem() {
        this.downloadIcon.setIcon(IconName.Download);
        this.downloadManualItem.addItem(i18nKeys.DownloadManual, this.downloadIcon.rootElement);

        this.downloadManualItem.onItemPress.subscribe(() => {
            console.log("downloadManualItem");
        });

    }

    private addSignOutItem() {
        this.signOutIcon.setIcon(IconName.SignOut);
        this.signOutItem.addItem(i18nKeys.SignOut, this.signOutIcon.rootElement);

        this.signOutItem.onItemPress.subscribe(() => {
            this.messenger.send(Messages.CloseAllMenus);
            this.messenger.send(Messages.CloseSettings);

            this.messenger.send(Messages.UserAuthorized, false);
        });
    }

    private handleItemsVisibility(isAuthorized: boolean) {
        if (isAuthorized) {
            this.signInItem.hide();
            this.signOutItem.show();
        } else {
            this.signInItem.show();
            this.signOutItem.hide();
        }
    }
}