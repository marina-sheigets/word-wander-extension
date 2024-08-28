import { singleton } from "tsyringe";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { InputComponent } from "../input.component";

@singleton()
export class FindWordInputComponent extends InputComponent {
    constructor(
        protected i18nService: I18nService,
    ) {
        super(i18nService);

        this.setInputSettings('text', i18nKeys.EnterWord);
    }
}