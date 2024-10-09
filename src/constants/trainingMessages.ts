import { Messages } from "./messages";

export const StartTrainingsMessages: { [gameID: number]: Messages } = {
    1: Messages.StartWordTranslationTraining,
    2: Messages.StartTranslationWordTraining
}

export const FinishTrainingsMessages: { [gameID: number]: Messages } = {
    1: Messages.FinishWordTranslationTraining,
    2: Messages.FinishTranslationWordTraining
}

