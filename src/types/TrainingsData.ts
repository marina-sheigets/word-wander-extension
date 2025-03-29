import { Word } from "./Word";

export interface WordTranslationTrainingData {
    translations: Word[];
    variants: Variant[];
}

export interface TranslationWordTrainingData extends WordTranslationTrainingData { }

export interface RepeatingTrainingData extends WordTranslationTrainingData { }

export interface AudioChallengeTrainingData extends WordTranslationTrainingData { }

export interface WordConstructionTrainingData {
    translations: Word[];
}

export interface ListeningTrainingData extends WordConstructionTrainingData { }

export interface Variant {
    word: string;
    translations: string[];
}