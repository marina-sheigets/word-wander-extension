import { injectable } from "tsyringe";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { Informer } from "../../../services/informer/informer.service";
import { ButtonComponent } from "../button.component";
import * as styles from './skip-word-button.component.css';

@injectable()
export class SkipWordButtonComponent extends ButtonComponent {
    public readonly onSkipButtonClick = new Informer();

    constructor(
        protected i18nService: I18nService,
    ) {
        super(i18nService);
        this.applyRootStyle(styles);

        this.addButtonName(i18nKeys.SkipWord);

        this.onClick.subscribe(() => this.onSkipButtonClick.inform());
    }
}