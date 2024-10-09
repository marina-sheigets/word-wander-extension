import { singleton } from 'tsyringe';
import * as styles from './settings-popup.component.css'
import { PopupComponent } from '../popup.component';
import { MessengerService } from '../../../services/messenger/messenger.service';
import { Messages } from '../../../constants/messages';
import { I18nService } from '../../../services/i18n/i18n.service';
import { i18nKeys } from '../../../services/i18n/i18n-keys';
import { SettingsTabsComponent } from './settings-tabs/settings-tabs.component';

@singleton()
export class SettingsPopupComponent extends PopupComponent {
    constructor(
        protected messenger: MessengerService,
        protected i18n: I18nService,
        protected settingsTabs: SettingsTabsComponent
    ) {
        super(i18n);

        this.setWidth("600px");
        this.applyRootStyle(styles);

        this.setTitle(i18nKeys.Settings);
        this.setContent(this.settingsTabs.rootElement);

        this.hide();

        this.messenger.subscribe(Messages.OpenSettings, this.show.bind(this));
    }
}