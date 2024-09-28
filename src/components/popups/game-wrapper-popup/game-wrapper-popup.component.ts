import { I18nService } from "../../../services/i18n/i18n.service";
import { PopupComponent } from "../popup.component";

export class GameWrapperPopupComponent extends PopupComponent {
    constructor(
        protected i18n: I18nService
    ) {
        super(i18n);

    }
}