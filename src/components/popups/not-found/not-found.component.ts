import { singleton } from "tsyringe";
import { IconService } from "../../../services/icon/icon.component";
import { PopupComponent } from "../popup.component";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";

@singleton()
export class NotFoundPopupComponent extends PopupComponent {
    content = document.createElement('p');

    constructor(
        protected iconService: IconService,
        protected i18n: I18nService
    ) {
        super(iconService, i18n);

        this.setTitle(i18nKeys.NoTextFound);

        this.i18n.follow(i18nKeys.SelectSomeText, (text) => {
            this.content.textContent = text;
        });

        this.setContent(this.content);
        this.hide();
    }
}