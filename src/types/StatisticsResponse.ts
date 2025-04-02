import { TrainingNames } from "../constants/trainingNames"

export interface StatisticsResponse {
    dictionary: {
        total_pronounced_words: number,
        total_searched_words: number
    },
    trainings: {
        least_successful_training: TrainingNames,
        most_effective_training: TrainingNames
    },
    other: {
        added_words: number,
        total_deleted_words: number
    }
}