import { singleton } from "tsyringe";
import { IconService } from "../../../services/icon/icon.component";
import { PopupComponent } from "../popup.component";

@singleton()
export class SearchErrorPopupComponent extends PopupComponent {
    private content = document.createElement('div');

    constructor(
        protected iconService: IconService
    ) {
        super(iconService);

        this.setTitle('Error');
        this.content.textContent = 'Text translation is not available at the moment. Please enter only one word at a time.';
        this.setContent(this.content);
        this.hide();
    }
}