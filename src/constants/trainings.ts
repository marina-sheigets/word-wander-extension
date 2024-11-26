import { i18nKeys } from "../services/i18n/i18n-keys";
import { Training } from "../types/Training";

export const trainings: Training[] = [
    {
        id: 1,
        title: i18nKeys.WordTranslationTitle,
        description: i18nKeys.WordTranslationDescription,
        name: 'word-translation',
    },
    {
        id: 2,
        title: i18nKeys.TranslationWordTitle,
        description: i18nKeys.TranslationWordDescription,
        name: 'translation-word',
    },
    {
        id: 3,
        title: i18nKeys.RepeatWordsTitle,
        description: i18nKeys.RepeatWordsDescription,
        name: 'repeating',
    },
    {
        id: 4,
        title: i18nKeys.WordConstructionTitle,
        description: i18nKeys.WordConstructionDescription,
        name: 'word-construction',
    },
    {
        id: 5,
        title: i18nKeys.ListeningTitle,
        description: i18nKeys.ListeningDescription,
        name: 'listening',
    },
    {
        id: 6,
        title: i18nKeys.AudioChallengeTitle,
        description: i18nKeys.AudioChallengeDescription,
        name: 'audio-challenge',
    }
];
