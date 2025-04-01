import { singleton } from "tsyringe";
import { BaseComponent } from "../../../../base-component/base-component";
import * as styles from "./statistics-tab.component.css";
import { DictionaryStatisticsComponent } from "./statistics/dictionary-statistics/dictionary-statistics.component";
import { TrainingsStatisticsComponent } from "./statistics/trainings-statistics/trainings-statistics.component";
import { OtherStatisticsComponent } from "./statistics/other-statistics/other-statistics.component";

@singleton()
export class StatisticsTabComponent extends BaseComponent {

    private statisticsSections = document.createElement("div");

    constructor(
        protected dictionaryStatistics: DictionaryStatisticsComponent,
        protected trainingsStatistics: TrainingsStatisticsComponent,
        protected otherStatistics: OtherStatisticsComponent
    ) {
        super(styles);

        this.statisticsSections.classList.add(styles.statisticsSections);

        this.statisticsSections.append(
            this.dictionaryStatistics.rootElement,
            this.trainingsStatistics.rootElement,
            this.otherStatistics.rootElement
        );

        this.rootElement.append(
            this.statisticsSections
        );
    }
}