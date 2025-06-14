import { injectable } from "tsyringe";
import { ButtonComponent } from "../button.component";
import * as styles from './submit-button.component.css';
import { I18nService } from "../../../services/i18n/i18n.service";
import { i18nKeys } from "../../../services/i18n/i18n-keys";

@injectable()
export class SubmitButton extends ButtonComponent {
    constructor(
        protected i18n: I18nService
    ) {
        super(i18n);
        this.applyRootStyle(styles);

        this.addButtonName(i18nKeys.Submit);

    }
}