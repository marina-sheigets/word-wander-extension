import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { PopupComponent } from "../popup.component";

export class GameWrapperPopupComponent extends PopupComponent {
    constructor(
        protected i18n: I18nService
    ) {
        super(i18n);

        this.setWidth('600px');
    }

    setGameName(title: i18nKeys) {
        this.setTitle(title);
    }
}