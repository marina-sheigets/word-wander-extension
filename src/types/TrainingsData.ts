export interface WordTranslationTrainingData {
    translations: {
        word: string;
        translation: string;
    }[];
    variants: Variant[];
}

export interface TranslationWordTrainingData extends WordTranslationTrainingData { }

export interface RepeatingTrainingData extends WordTranslationTrainingData { }

export interface Variant {
    word: string;
    translations: string[];
}