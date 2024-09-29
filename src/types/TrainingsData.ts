export interface WordTranslationTrainingData {
    translations: {
        word: string;
        translation: string;
    }[];
    variants: {
        word: string;
        translations: string[];
    }[];
}