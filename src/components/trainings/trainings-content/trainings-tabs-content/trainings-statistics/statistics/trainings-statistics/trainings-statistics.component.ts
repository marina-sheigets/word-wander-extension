

import { singleton } from "tsyringe";
import { TrainingNames } from "../../../../../../../constants/trainingNames";
import { i18nKeys } from "../../../../../../../services/i18n/i18n-keys";
import { I18nService } from "../../../../../../../services/i18n/i18n.service";
import { StatisticsComponent } from "../statistics.component";
import * as styles from "./trainings-statistics.component.css";

@singleton()
export class TrainingsStatisticsComponent extends StatisticsComponent {

    constructor(
        protected i18n: I18nService
    ) {
        super(i18n);

        this.applyRootStyle(styles);

        this.setTitle(i18nKeys.Trainings);

        this.setData([
            {
                statisticsName: i18nKeys.LearnedWords,
                value: "100"
            },
            {
                statisticsName: i18nKeys.SkippedWords,
                value: "224"
            },
            {
                statisticsName: i18nKeys.AccuracyRateOnTrainings,
                value: "89%"
            },
            {
                statisticsName: i18nKeys.MostEffectiveTraining,
                value: TrainingNames.Repeating
            },
            {
                statisticsName: i18nKeys.LeastSuccessfulTraining,
                value: TrainingNames.Listening
            },
            {
                statisticsName: i18nKeys.TotalInterruptedTrainings,
                value: "20"
            },
            {
                statisticsName: i18nKeys.TrainingsCompleted,
                value: "42"
            },
        ])
    }
}