export enum StatisticsPath {
    // Dictionary
    TOTAL_PRONOUNCED_WORDS = 'dictionary.total_pronounced_words',
    TOTAL_SEARCHED_WORDS = 'dictionary.total_searched_words',

    // Other
    ADDED_WORDS = 'other.added_words',
    TOTAL_WORDS_IN_DICTIONARY = 'other.total_words_in_dictionary',
    TOTAL_DELETED_WORDS = 'other.total_deleted_words',

    // Trainings
    LEARNED_WORDS = 'trainings.learned_words',
    SKIPPED_WORDS = 'trainings.skipped_words',
    ACCURACY_RATE = 'trainings.accuracy_rate',
    MOST_EFFECTIVE_TRAINING = 'trainings.most_effective_training',
    LEAST_SUCCESSFUL_TRAINING = 'trainings.least_successful_training',
    TOTAL_INTERRUPTED_TRAININGS = 'trainings.total_interrupted_trainings',
}
