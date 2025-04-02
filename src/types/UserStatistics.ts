import { UserStatisticsItem } from "./UserStatisticsItem";

export interface UserStatistics {
    dictionary: UserStatisticsItem[],
    trainings: UserStatisticsItem[],
    other: UserStatisticsItem[],
}