import { singleton } from "tsyringe";
import { IconService } from "../../../services/icon/icon.component";
import { PopupComponent } from "../popup.component";
import { I18nService } from "../../../services/i18n/i18n.service";
import { i18nKeys } from "../../../services/i18n/i18n-keys";

@singleton()
export class SearchErrorPopupComponent extends PopupComponent {
    private content = document.createElement('div');

    constructor(
        protected iconService: IconService,
        protected i18n: I18nService
    ) {
        super(iconService, i18n);

        this.setTitle(i18nKeys.Error);
        this.content.textContent = 'Text translation is not available at the moment. Please enter only one word at a time.';
        this.setContent(this.content);
        this.hide();
    }
}