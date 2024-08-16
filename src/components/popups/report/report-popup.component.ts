import { singleton } from "tsyringe";
import { IconService } from "../../../services/icon/icon.component";
import { SubmitButton } from "../../button/submit/submit-button.component";
import { PopupComponent } from "../popup.component";
import * as styles from './report-popup.component.css';
import { MessengerService } from "../../../services/messenger/messenger.service";
import { Messages } from "../../../constants/messages";
import { TextareaComponent } from "../../textarea/textarea.component";
import { I18nService } from "../../../services/i18n/i18n.service";
import { i18nKeys } from "../../../services/i18n/i18n-keys";

@singleton()
export class ReportPopupComponent extends PopupComponent {
    private content = document.createElement('div');

    constructor(
        protected iconService: IconService,
        protected submitButton: SubmitButton,
        protected messenger: MessengerService,
        protected textarea: TextareaComponent,
        protected i18n: I18nService
    ) {
        super(iconService, i18n);
        this.applyRootStyle(styles);

        this.setWidth('400px');
        this.setTitle(i18nKeys.ReportBug);
        this.content.textContent = `Provide a detailed description of the bug including steps to reproduce it, 
                                    expected behavior, and actual behavior. Include any relevant information or observations.`;
        this.content.classList.add(styles.content);

        this.submitButton.addButtonName(i18nKeys.Submit);

        this.textarea.setPlaceholder('Describe the bug...');
        this.textarea.setRows(5);

        this.setContent(this.content);
        this.setContent(this.textarea.rootElement);
        this.setContent(this.submitButton.rootElement);

        this.hide();
        this.messenger.subscribe(Messages.OpenReportPopup, this.show.bind(this));
    }

}