import { singleton } from "tsyringe";
import { i18nKeys } from "../../../../../../../services/i18n/i18n-keys";
import { I18nService } from "../../../../../../../services/i18n/i18n.service";
import { StatisticsComponent } from "../statistics.component";
import * as styles from "./dictionary-statistics.component.css";

@singleton()
export class DictionaryStatisticsComponent extends StatisticsComponent {

    constructor(
        protected i18n: I18nService
    ) {
        super(i18n);

        this.applyRootStyle(styles);

        this.setTitle(i18nKeys.Dictionary);
    }
}