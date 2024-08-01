import { singleton } from "tsyringe";
import { IconService } from "../../../services/icon/icon.component";
import { PopupComponent } from "../popup.component";

@singleton()
export class NotFoundPopupComponent extends PopupComponent {
    content = document.createElement('p');

    constructor(
        protected iconService: IconService
    ) {
        super(iconService);

        this.setTitle('No selected text found');

        this.content.textContent = 'Please select some text and try again.';

        this.setContent(this.content);
        this.hide();
    }
}