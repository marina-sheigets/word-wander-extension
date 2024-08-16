import { injectable } from "tsyringe";
import { IconService } from "../../../services/icon/icon.component";
import { ButtonComponent } from "../button.component";
import * as styles from './submit-button.component.css';
import { I18nService } from "../../../services/i18n/i18n.service";

@injectable()
export class SubmitButton extends ButtonComponent {
    constructor(
        protected iconService: IconService,
        protected i18n: I18nService
    ) {
        super(iconService, i18n);
        this.applyRootStyle(styles);
    }
}