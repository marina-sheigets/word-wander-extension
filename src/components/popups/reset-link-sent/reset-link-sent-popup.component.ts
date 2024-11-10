import { singleton } from "tsyringe";
import { ButtonComponent } from "../../button/button.component";
import { PopupComponent } from "../popup.component";
import * as styles from './reset-link-sent-popup.component.css';
import { I18nService } from "../../../services/i18n/i18n.service";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { Messages } from "../../../constants/messages";

@singleton()
export class ResetLinkSentPopupComponent extends PopupComponent {
    private content = document.createElement('div');
    private description = document.createElement('div');
    private subdescription = document.createElement('div');

    constructor(
        protected okButton: ButtonComponent,
        protected i18n: I18nService,
        protected messenger: MessengerService
    ) {
        super(i18n);
        this.applyRootStyle(styles);

        this.setTitle(i18nKeys.ResetPassword);

        this.i18n.follow(i18nKeys.ResetLinkDescription, (text) => {
            this.description.textContent = text;
        });

        this.i18n.follow(i18nKeys.ResetLinkSubDescription, (text) => {
            this.subdescription.textContent = text;
        });


        this.content.classList.add(styles.content);
        this.description.classList.add(styles.description);
        this.subdescription.classList.add(styles.subdescription);

        this.okButton.addButtonName(i18nKeys.Okay);

        this.okButton.onClick.subscribe(this.hide.bind(this));

        this.content.append(
            this.description,
            this.subdescription,
            this.okButton.rootElement
        )

        this.setContent(this.content);

        this.hide();

        this.messenger.subscribe(Messages.ResetPasswordLinkSent, this.show.bind(this));
    }
}