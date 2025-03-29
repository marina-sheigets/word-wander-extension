import { TrainingNames } from "../constants/trainingNames";
import { RepeatingTrainingData, TranslationWordTrainingData, WordTranslationTrainingData } from "../types/TrainingsData";
import { Word } from "../types/Word";
import { shuffleArray } from "./shuffleArray";

export const shuffleWordsForTraining = (words: Word[], trainingName: TrainingNames) => {
    switch (trainingName) {
        case TrainingNames.WordTranslation:
            return shuffleForWordTranslation(words);
        case TrainingNames.TranslationWord:
            return shuffleForTranslationWord(words);
        case TrainingNames.Repeating:
            return shuffleForRepeating(words);
        // case TrainingNames.WordConstructor:
        //     return shuffleForWordConstructor(words);
        // case TrainingNames.Listening:
        //     return shuffleForListening(words);
        // case TrainingNames.AudioChallenge:
        //     return shuffleForAudioChallenge(words);
        default:
            return null;
    }
}

const shuffleForWordTranslation = (words: Word[]) => {
    const result: WordTranslationTrainingData = {
        translations: [],
        variants: []
    }

    const shuffledWords = shuffleArray(words);

    result.translations = shuffledWords;

    shuffledWords.forEach(currentWord => {
        const wordsWithoutCurrent = words.filter(word => word.word !== currentWord.word);
        const shuffledWordsWithoutCurrent = shuffleArray(wordsWithoutCurrent).slice(0, 3).map(word => word.translation);

        result.variants.push({
            word: currentWord.word,
            translations: shuffleArray([currentWord.translation, ...shuffledWordsWithoutCurrent])
        });

    });

    return result;
}

const shuffleForTranslationWord = (words: Word[]) => {
    const result: TranslationWordTrainingData = {
        translations: [],
        variants: []
    }

    const shuffledWords = shuffleArray(words);

    result.translations = shuffledWords;

    shuffledWords.forEach(currentWord => {
        const wordsWithoutCurrent = words.filter(word => word.word !== currentWord.word);
        const shuffledWordsWithoutCurrent = shuffleArray(wordsWithoutCurrent).slice(0, 3).map(word => word.word);

        result.variants.push({
            word: currentWord.translation,
            translations: shuffleArray([currentWord.word, ...shuffledWordsWithoutCurrent])
        });

    });

    return result;
}

const shuffleForRepeating = (words: Word[]) => {
    const result: RepeatingTrainingData = {
        translations: [],
        variants: []
    }

    const shuffledWords = shuffleArray(words);

    result.translations = shuffledWords;

    shuffledWords.forEach(currentWord => {
        const wordsWithoutCurrent = words.filter(word => word.word !== currentWord.word);
        const randomTranslation = shuffleArray(wordsWithoutCurrent)[0].word;

        result.variants.push({
            word: currentWord.translation,
            translations: shuffleArray([currentWord.word, randomTranslation])
        });

    });

    return result;
}

// const shuffleForWordConstructor = (words: Word[]) => {

// }

// const shuffleForListening = (words: Word[]) => {

// }

// const shuffleForAudioChallenge = (words: Word[]) => {

// }
