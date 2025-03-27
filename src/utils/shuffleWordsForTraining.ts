import { TrainingNames } from "../constants/trainingNames";
import { WordTranslationTrainingData } from "../types/TrainingsData";
import { Word } from "../types/Word";
import { shuffleArray } from "./shuffleArray";

export const shuffleWordsForTraining = (words: Word[], trainingName: TrainingNames) => {
    switch (trainingName) {
        case TrainingNames.WordTranslation:
            return shuffleForWordTranslation(words);
        // case TrainingNames.TranslationWord:
        //     return shuffleForTranslationWord(words);
        // case TrainingNames.Repeating:
        //     return shuffleForRepeating(words);
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

    result.translations = shuffledWords.map(word => ({
        word: word.word,
        translation: word.translation
    }));

    shuffledWords.forEach(currentWord => {
        const wordsWithoutCurrent = words.filter(word => word.word !== currentWord.word);
        const shuffledWordsWithoutCurrent = shuffleArray(wordsWithoutCurrent).slice(0, 3).map(word => word.translation);

        result.variants.push({
            word: currentWord.word,
            translations: shuffleArray([currentWord.translation, ...shuffledWordsWithoutCurrent])
        });

    });

    debugger
    return result;
}

// const shuffleForTranslationWord = (words: Word[]) => {

// }

// const shuffleForRepeating = (words: Word[]) => {

// }

// const shuffleForWordConstructor = (words: Word[]) => {

// }

// const shuffleForListening = (words: Word[]) => {

// }

// const shuffleForAudioChallenge = (words: Word[]) => {

// }
