import { singleton } from "tsyringe";
import { I18nService } from "../../../services/i18n/i18n.service";
import { PopupComponent } from "../popup.component";
import * as styles from './game-wrapper-popup.component.css';
import { MessengerService } from "../../../services/messenger/messenger.service";
import { Messages } from "../../../constants/messages";
@singleton()
export class GameWrapperPopupComponent extends PopupComponent {
    constructor(
        protected i18n: I18nService,
        protected messenger: MessengerService
    ) {
        super(i18n);
        this.applyRootStyle(styles);

        this.backdrop.classList.add(styles.disableBackground);
        this.closeButton.onclick = (e) => {
            e.stopPropagation();
            this.messenger.send(Messages.ShowCloseTrainingPopup);
        }
    }
}