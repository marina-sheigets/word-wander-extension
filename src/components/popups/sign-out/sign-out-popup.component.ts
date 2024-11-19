import { singleton } from "tsyringe";
import { Messages } from "../../../constants/messages";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { ButtonComponent } from "../../button/button.component";
import { PopupComponent } from "../popup.component";
import * as styles from './sign-out-popup.component.css';
import { AuthService } from "../../../services/auth/auth.service";
import { SettingsService } from "../../../services/settings/settings.service";
import { SettingsNames } from "../../../constants/settingsNames";

@singleton()
export class SignOutPopupComponent extends PopupComponent {
    private content = document.createElement('div');
    private description = document.createElement('p');

    constructor(
        protected i18n: I18nService,
        protected yesButton: ButtonComponent,
        protected messenger: MessengerService,
        protected authService: AuthService,
        protected settingsService: SettingsService
    ) {
        super(styles);

        this.setTitle(i18nKeys.SignOut);

        i18n.follow(i18nKeys.SignOutDescription, (value) => {
            this.description.textContent = value;
        });

        this.content.classList.add(styles.content);

        this.yesButton.addButtonName(i18nKeys.Yes);
        this.yesButton.onClick.subscribe(this.confirmSignOut.bind(this));

        this.content.append(
            this.description,
            this.yesButton.rootElement
        );

        this.hide();
        this.setContent(this.content);

        this.messenger.subscribe(Messages.OpenSignOutPopup, this.show.bind(this));
    }

    private confirmSignOut() {
        this.hide();
        this.settingsService.set(SettingsNames.User, null);
        this.authService.signOut();
    }
}