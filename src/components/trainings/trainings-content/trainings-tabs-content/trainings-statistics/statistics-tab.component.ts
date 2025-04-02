import { singleton } from "tsyringe";
import { BaseComponent } from "../../../../base-component/base-component";
import * as styles from "./statistics-tab.component.css";
import { DictionaryStatisticsComponent } from "./statistics/dictionary-statistics/dictionary-statistics.component";
import { TrainingsStatisticsComponent } from "./statistics/trainings-statistics/trainings-statistics.component";
import { OtherStatisticsComponent } from "./statistics/other-statistics/other-statistics.component";
import { SettingsService } from "../../../../../services/settings/settings.service";
import { SettingsNames } from "../../../../../constants/settingsNames";
import { UserData } from "../../../../../types/UserData";
import { UserStatisticsService } from "../../../../../services/user-statistics/user-statistics.service";
import { StatisticsResponse } from "../../../../../types/StatisticsResponse";

@singleton()
export class StatisticsTabComponent extends BaseComponent {

    private statisticsSections = document.createElement("div");

    constructor(
        protected dictionaryStatistics: DictionaryStatisticsComponent,
        protected trainingsStatistics: TrainingsStatisticsComponent,
        protected otherStatistics: OtherStatisticsComponent,
        protected settingsService: SettingsService,
        protected userStatistics: UserStatisticsService
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

        this.settingsService.subscribe(SettingsNames.User, this.fetchStatistics.bind(this))
    }

    private fetchStatistics(user: UserData) {
        if (!user) {
            return;
        }

        this.userStatistics.getStatistics().then((res) => {
            if (!res?.data) {
                return;
            }

            const statisticsData = res.data[0];

            const statistics = this.userStatistics.mapStatisticsToFormat({
                trainings: statisticsData.trainings,
                dictionary: statisticsData.dictionary,
                other: statisticsData.other
            });

            this.dictionaryStatistics.setData(statistics.dictionary);
            this.trainingsStatistics.setData(statistics.trainings);
            this.otherStatistics.setData(statistics.other);
        })
    }
}