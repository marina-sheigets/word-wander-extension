import { singleton } from "tsyringe";
import { Messages } from "../../../constants/messages";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { ButtonComponent } from "../../button/button.component";
import { PopupComponent } from "../popup.component";
import * as styles from './close-training-popup.component.css';
@singleton()
export class CloseTrainingPopup extends PopupComponent {
    private content = document.createElement('div');
    private description = document.createElement('p');

    constructor(
        protected i18n: I18nService,
        protected yesButton: ButtonComponent,
        protected messenger: MessengerService
    ) {
        super(i18n);

        this.rootElement.classList.add(styles.closeTrainingPopup);
        this.content.classList.add(styles.content);

        i18n.follow(i18nKeys.FinishTrainingDescription, (value) => {
            this.description.textContent = value;
        });

        this.setTitle(i18nKeys.FinishTrainingDescription);

        this.yesButton.addButtonName(i18nKeys.Yes);
        this.yesButton.onClick.subscribe(() => {
            this.hideTrainingPopup();
        });
        this.content.append(
            this.description,
            this.yesButton.rootElement
        );
        this.setContent(this.content);

        this.hide();

        this.messenger.subscribe(Messages.ShowCloseTrainingPopup, () => { this.show() });
    }

    private hideTrainingPopup() {
        this.hide();
        this.messenger.send(Messages.InterruptTraining);
    }
}