export const URL = {
    dictionary: {
        addWord: 'dictionary/add-word',
        getWords: 'dictionary/get-words',
        deleteWord: 'dictionary/delete-word',
        deleteWords: 'dictionary/delete-words',
    },
    auth: {
        login: 'auth/login',
        signUp: 'auth/signup',
        refreshToken: 'auth/refresh',
        changePassword: 'auth/change-password',
        signOut: 'auth/logout',
        deleteAccount: 'auth/delete-account',
    },
    training: {
        getAmountWordsForTrainings: 'training/get-amount-words-for-trainings',
        sendWordsOnTrainings: 'training/add-words-for-trainings',
        getWordsForTraining: 'training/get-words',
        deleteWordsFromTraining: 'training/delete-words-from-training',
        finishTraining: "training/finish-training"
    },
    statistics: {
        getStatistics: "statistics",
        updateStatistics: "statistics"
    }
}