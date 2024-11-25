import { singleton } from "tsyringe";
import { Messages } from "../../../constants/messages";
import { AuthService } from "../../../services/auth/auth.service";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { SettingsService } from "../../../services/settings/settings.service";
import { TrainingsTab } from "../../../types/TrainingsTabs";
import { ButtonComponent } from "../../button/button.component";
import { PopupComponent } from "../popup.component";
import * as styles from './not-enough-words-popup.component.css';

@singleton()
export class NotEnoughWordsPopup extends PopupComponent {
    private content = document.createElement('div');
    private description = document.createElement('p');

    constructor(
        protected i18n: I18nService,
        protected goToDictionary: ButtonComponent,
        protected messenger: MessengerService,
        protected authService: AuthService,
        protected settingsService: SettingsService

    ) {
        super(styles);

        this.setTitle(i18nKeys.NotEnoughWordsTitle);

        i18n.follow(i18nKeys.NotEnoughWordsDescription, (value) => {
            this.description.textContent = value;
        });

        this.content.classList.add(styles.content);

        this.goToDictionary.addButtonName(i18nKeys.GoToDictionary);
        this.goToDictionary.onClick.subscribe(this.handleGoToDictionary.bind(this));

        this.content.append(
            this.description,
            this.goToDictionary.rootElement
        );

        this.setContent(this.content);

        this.hide();

        this.messenger.subscribe(Messages.ShowNotEnoughWordsPopup, this.show.bind(this));
    }

    private handleGoToDictionary() {
        this.hide();
        this.messenger.send(Messages.ChangeTab, TrainingsTab.Dictionary);
    }
}