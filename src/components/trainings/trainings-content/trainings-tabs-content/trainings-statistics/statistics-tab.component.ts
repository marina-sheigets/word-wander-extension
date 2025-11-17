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
import { UserStatistics } from "../../../../../types/UserStatistics";
import { I18nService } from "../../../../../services/i18n/i18n.service";
import { i18nKeys } from "../../../../../services/i18n/i18n-keys";

@singleton()
export class StatisticsTabComponent extends BaseComponent {
    private readonly statisticsSections = document.createElement("div");
    private readonly statisticsUnavailableBlock = document.createElement("div");

    constructor(
        protected dictionaryStatistics: DictionaryStatisticsComponent,
        protected trainingsStatistics: TrainingsStatisticsComponent,
        protected otherStatistics: OtherStatisticsComponent,
        protected settingsService: SettingsService,
        protected userStatistics: UserStatisticsService,
        protected i18n: I18nService
    ) {
        super(styles);

         this.i18n.follow(i18nKeys.NotEnoughDataForStatistics, (value: string) => {
            this.statisticsUnavailableBlock.textContent = value;
        });

        this.hideStatisticsUnavailableBlock();

        this.statisticsUnavailableBlock.classList.add(styles.statisticsUnavailableBlock);
        this.statisticsSections.classList.add(styles.statisticsSections);

        this.rootElement.append(
            this.statisticsSections,
            this.statisticsUnavailableBlock
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
                trainings: statisticsData?.trainings,
                dictionary: statisticsData?.dictionary,
                other: statisticsData?.other
            });

            if(statistics.dictionary.length){
                this.statisticsSections.append( this.dictionaryStatistics.rootElement);
                this.dictionaryStatistics.setData(statistics.dictionary);
            }

            if(statistics.trainings.length){
                this.statisticsSections.append( this.trainingsStatistics.rootElement);
                this.trainingsStatistics.setData(statistics.trainings);
            }

            if(statistics.other.length){
                this.statisticsSections.append( this.otherStatistics.rootElement);
                this.otherStatistics.setData(statistics.other);
            }

            this.toggleUnavailableStatisticsMessage(statistics);
        })
    }

    private toggleUnavailableStatisticsMessage(statistics:UserStatistics) {
        if(this.isStatisticsUnavailable(statistics)) {
            this.showStatisticsUnavailableBlock();
        }else{
            this.hideStatisticsUnavailableBlock();
        }
    }

    private hideStatisticsUnavailableBlock() {
        this.statisticsUnavailableBlock.style.display = "none";
    }

    private  showStatisticsUnavailableBlock() {
        this.statisticsUnavailableBlock.style.display = "block";
    }

    private isStatisticsUnavailable(statistics:UserStatistics) {
       return Object.entries(statistics).every(([_, value]) => !value.length);
    }
}