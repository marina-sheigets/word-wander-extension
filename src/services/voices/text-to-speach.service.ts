import { singleton } from "tsyringe";
import { SettingsService } from "../settings/settings.service";

@singleton()
export class TextToSpeechService {
    private synth: SpeechSynthesis;
    private voices: SpeechSynthesisVoice[] = [];

    constructor(
        protected settingsService: SettingsService
    ) {
        this.synth = window.speechSynthesis;

        this.setVoices();
    }

    setVoices() {
        this.voices = this.synth.getVoices();
    }

    getVoices() {
        return this.voices;
    }

    play(text: string) {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'en';
        speech.voice = this.voices[1];

        this.synth.speak(speech);
    }

}