import { singleton } from "tsyringe";
import { URL } from "../../constants/urls";
import { StatisticsData } from "../../types/StatisticsData";
import { HttpService } from "../http/http.service";
import { StatisticsResponse } from "../../types/StatisticsResponse";
import { i18nKeys } from "../i18n/i18n-keys";
import { UserStatistics } from "../../types/UserStatistics";
import { SettingsService } from "../settings/settings.service";
import { SettingsNames } from "../../constants/settingsNames";

@singleton()
export class UserStatisticsService {

    constructor(
        protected httpService: HttpService,
        protected settings: SettingsService
    ) { }

    public updateStatistics(statisticsData: StatisticsData) {
        if (!this.settings.get(SettingsNames.User)) {
            return;
        }

        this.httpService.post(URL.statistics.updateStatistics, statisticsData);
    }

    public async getStatistics() {
        return await this.httpService.get(URL.statistics.getStatistics);
    }

    public mapStatisticsToFormat(statisticsResponse: StatisticsResponse): UserStatistics {

        type StatisticKeys = keyof StatisticsResponse;

        const StatisticsMapObject = {
            dictionary: {
                total_pronounced_words: i18nKeys.TotalPronouncedWords,
                total_searched_words: i18nKeys.TotalSearchedWords
            },
            trainings: {
                learned_words: i18nKeys.LearnedWords,
                skipped_words: i18nKeys.SkippedWords,
                accuracy_rate: i18nKeys.AccuracyRateOnTrainings,
                least_successful_training: i18nKeys.LeastSuccessfulTraining,
                most_effective_training: i18nKeys.MostEffectiveTraining,
                completed_trainings: i18nKeys.TrainingsCompleted,
                interrupted_trainings: i18nKeys.TrainingsInterrupted
            },
            other: {
                added_words: i18nKeys.AddedWords,
                total_deleted_words: i18nKeys.TotalDeletedWords
            }
        };

        const resultStatistics: UserStatistics = {
            dictionary: [],
            trainings: [],
            other: []
        };



        for (let key in statisticsResponse) {
            const typedKey = key as StatisticKeys;
            const statisticsSectionObject = statisticsResponse[typedKey];


            for (let statisticsName in statisticsSectionObject) {
                // @ts-ignore
                const statisticsValue = statisticsSectionObject[statisticsName];

                resultStatistics[typedKey].push({
                    // @ts-ignore
                    statisticsName: StatisticsMapObject[typedKey][statisticsName],
                    value: statisticsValue
                });
            }
        }

        return resultStatistics;
    }
}