import { injectable } from "tsyringe";
import { i18nKeys } from "../../../../../../services/i18n/i18n-keys";
import { I18nService } from "../../../../../../services/i18n/i18n.service";
import { BaseComponent } from "../../../../../base-component/base-component";
import * as styles from './statistics.component.css';

@injectable()
export class StatisticsComponent extends BaseComponent {
    private title = document.createElement("h3");
    private statisticsSection = document.createElement("div");


    constructor(
        protected i18n: I18nService
    ) {
        super(styles);

        this.statisticsSection.classList.add(styles.statisticsSection);

        this.rootElement.append(
            this.title,
            this.statisticsSection
        );
    }


    public setTitle(key: i18nKeys) {
        this.i18n.subscribe(key, (title: string) => {
            this.title.textContent = title;
        })
    }

    public setData(statisticsData: { statisticsName: i18nKeys, value: string }[]) {
        this.statisticsSection.textContent = "";

        statisticsData.forEach(item => {
            const row = document.createElement("div");
            row.classList.add(styles.statisticsRow);

            const label = document.createElement("label");

            const value = document.createElement("div");

            this.i18n.follow(item.statisticsName, (labelName: string) => {
                label.textContent = labelName;
            });

            value.textContent = item.value;

            row.append(
                label,
                value
            );

            this.statisticsSection.append(row);
        });
    }

}