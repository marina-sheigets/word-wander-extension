import { Messages } from "./messages";

export const StartTrainingsMessages: { [gameID: number]: Messages } = {
    1: Messages.StartWordTranslationTraining,
    2: Messages.StartTranslationWordTraining,
    3: Messages.StartRepeatingTraining,
    4: Messages.StartWordConstructionTraining,
    5: Messages.StartListeningTraining
}

export const FinishTrainingsMessages: { [gameID: number]: Messages } = {
    1: Messages.FinishWordTranslationTraining,
    2: Messages.FinishTranslationWordTraining,
    3: Messages.FinishRepeatingTraining,
    4: Messages.FinishWordConstructionTraining,
    5: Messages.FinishListeningTraining
}

