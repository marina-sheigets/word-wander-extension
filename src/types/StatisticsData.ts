import { StatisticsPath } from "../constants/statisticsPaths";

export interface StatisticsData {
    fieldPath: StatisticsPath,
    accuracyRate?: number;
    count?: number
}