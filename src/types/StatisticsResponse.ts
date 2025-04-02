import { TrainingNames } from "../constants/trainingNames"

export interface StatisticsResponse {
    dictionary: {
        total_pronounced_words: number,
        total_searched_words: number
    },
    trainings: {
        learned_words: TrainingNames,
        skipped_words: TrainingNames,
        accuracy_rate: TrainingNames,
        least_successful_training: TrainingNames,
        most_effective_training: TrainingNames,
        completed_trainings: TrainingNames,
        interrupted_trainings: TrainingNames
    },
    other: {
        added_words: number,
        total_deleted_words: number
    }
}