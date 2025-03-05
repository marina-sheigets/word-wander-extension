import { singleton } from "tsyringe";
import incorrectSoundPath from '../../../assets/audios/training-error.mp3';
import startTraining from '../../../assets/audios/training-start.mp3';
import correctAnswerSound from '../../../assets/audios/training-right.mp3';


@singleton()
export class TrainingSound {
    constructor() { }

    static playIncorrectSound() {
        this.playSound(incorrectSoundPath);
    }

    static playCorrectSound() {
        this.playSound(correctAnswerSound);
    }

    static playStartTraining() {
        this.playSound(startTraining);
    }

    static async playSound(audioFile: string) {
        const sound = new Audio(audioFile);
        await sound.play();
    }
}