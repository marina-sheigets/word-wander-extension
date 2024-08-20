import { singleton } from "tsyringe";
import { PopupComponent } from "../popup.component";
import { I18nService } from "../../../services/i18n/i18n.service";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { IconComponent } from "../../icon/icon.component";

@singleton()
export class SearchErrorPopupComponent extends PopupComponent {
    private content = document.createElement('div');

    constructor(
        protected icon: IconComponent,
        protected i18n: I18nService
    ) {
        super(icon, i18n);

        this.setTitle(i18nKeys.Error);

        this.i18n.follow(i18nKeys.SearchErrorContent, (text) => {
            this.content.textContent = text;
        });

        this.setContent(this.content);
        this.hide();
    }
}