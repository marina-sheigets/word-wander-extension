import { singleton } from "tsyringe";
import { I18nService } from "../../../services/i18n/i18n.service";
import { PopupComponent } from "../popup.component";
import * as styles from './game-wrapper-popup.component.css';
@singleton()
export class GameWrapperPopupComponent extends PopupComponent {
    constructor(
        protected i18n: I18nService
    ) {
        super(i18n);

        this.backdrop.classList.add(styles.disableBackground);
    }
}