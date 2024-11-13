import { singleton } from "tsyringe";
import * as styles from './profile-settings.component.css';
import { I18nService } from "../../../../services/i18n/i18n.service";
import { i18nKeys } from "../../../../services/i18n/i18n-keys";
import { TabContent } from "../../../tab-content/tab-content.component";

@singleton()
export class ProfileSettingsComponent extends TabContent {
    constructor(
        protected i18n: I18nService
    ) {
        super(i18n);

        this.applyRootStyle(styles);

        this.setTitle(i18nKeys.Profile);


    }

}