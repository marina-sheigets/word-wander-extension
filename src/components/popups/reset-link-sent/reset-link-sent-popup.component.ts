import { singleton } from "tsyringe";
import { IconService } from "../../../services/icon/icon.component";
import { ButtonComponent } from "../../button/button.component";
import { PopupComponent } from "../popup.component";
import * as styles from './reset-link-sent-popup.component.css';

@singleton()
export class ResetLinkSentPopupComponent extends PopupComponent {
    private content = document.createElement('div');
    private description = document.createElement('div');
    private subdescription = document.createElement('div');

    constructor(
        protected iconService: IconService,
        protected okButton: ButtonComponent
    ) {
        super(iconService);
        this.applyRootStyle(styles);

        this.setTitle('Reset Password');

        this.description.textContent = 'A password reset link has been successfully sent to your email address.';
        this.subdescription.textContent = 'Please follow the instructions in the email to reset your password.';

        this.content.classList.add(styles.content);
        this.description.classList.add(styles.description);
        this.subdescription.classList.add(styles.subdescription);

        this.okButton.addButtonName('OK');
        this.okButton.rootElement.classList.add(styles.okButton);
        this.okButton.onClick.subscribe(this.hide.bind(this));

        this.content.append(
            this.description,
            this.subdescription,
            this.okButton.rootElement
        )

        this.setContent(this.content);

        this.hide();
    }
}