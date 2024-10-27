import { injectable } from "tsyringe";
import { TextToSpeechService } from "../../services/text-to-speech/text-to-speech.service";
import { IconName } from "../../types/IconName";
import { BaseComponent } from "../base-component/base-component";
import { IconComponent } from "../icon/icon.component";
import * as styles from "./word-player.component.css";

@injectable()
export class WordPlayerComponent extends BaseComponent {
    private word: string = '';
    private iconWrapper = document.createElement('div');

    constructor(
        protected textToSpeechService: TextToSpeechService,
        protected playIcon: IconComponent
    ) {
        super(styles);

        this.iconWrapper.classList.add(styles.iconWrapper);

        this.playIcon.setIcon(IconName.Audio);

        this.iconWrapper.append(this.playIcon.rootElement);

        this.rootElement.append(this.iconWrapper);
        this.iconWrapper.addEventListener('mousedown', this.playWord.bind(this));
    }

    public playWord() {
        this.textToSpeechService.play(this.word);
    }

    public setWord(word: string) {
        this.word = word;
    }
}