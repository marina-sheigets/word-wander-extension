import { singleton } from "tsyringe";
import { SubmitButton } from "../../button/submit/submit-button.component";
import { PopupComponent } from "../popup.component";
import * as styles from './report-popup.component.css';
import { MessengerService } from "../../../services/messenger/messenger.service";
import { Messages } from "../../../constants/messages";
import { TextareaComponent } from "../../textarea/textarea.component";
import { I18nService } from "../../../services/i18n/i18n.service";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { IconComponent } from "../../icon/icon.component";

@singleton()
export class ReportPopupComponent extends PopupComponent {
    private content = document.createElement('div');

    constructor(
        protected iconComponent: IconComponent,
        protected submitButton: SubmitButton,
        protected messenger: MessengerService,
        protected textarea: TextareaComponent,
        protected i18n: I18nService
    ) {
        super(i18n);
        this.applyRootStyle(styles);

        this.setWidth('400px');
        this.setTitle(i18nKeys.ReportBug);

        this.i18n.follow(i18nKeys.ReportPopupContent, (text) => {
            this.content.textContent = text;
        });

        this.content.classList.add(styles.content);

        this.textarea.setPlaceholder(i18nKeys.ReportBugPlaceholder);
        this.textarea.setRows(5);

        this.setContent(this.content);
        this.setContent(this.textarea.rootElement);
        this.setContent(this.submitButton.rootElement);

        this.hide();
        this.messenger.subscribe(Messages.OpenReportPopup, this.show.bind(this));
    }

}