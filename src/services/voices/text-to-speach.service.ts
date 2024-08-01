import { singleton } from "tsyringe";
import { SettingsService } from "../settings/settings.service";
import { Informer } from "../informer/informer.service";

@singleton()
export class TextToSpeechService {
    private synth: SpeechSynthesis;
    private voices: SpeechSynthesisVoice[] = [];
    private speech: SpeechSynthesisUtterance | null = null;
    public onPlayerFinished = new Informer();
    public isPaused = false;
    constructor(
        protected settingsService: SettingsService
    ) {
        this.synth = window.speechSynthesis;
        this.synth.onvoiceschanged = this.setVoices.bind(this);
    }

    setVoices() {
        this.voices = this.synth.getVoices();
    }

    getVoices() {
        return this.voices;
    }

    play(text: string) {
        if (this.synth.speaking && !this.isPaused) {
            return;
        }
        if (this.voices.length === 0) {
            alert("No voices available");
            this.onSpeakFinished();
            return;
        }
        this.synth.cancel();
        this.speech = new SpeechSynthesisUtterance(text);
        this.speech.lang = 'en';
        this.speech.voice = this.voices[0];

        this.speech.addEventListener('end', this.onSpeakFinished.bind(this));
        this.speech.addEventListener('error', this.onSpeakFinished.bind(this));

        this.synth.speak(this.speech);
        this.isPaused = false;
    }

    onSpeakFinished() {
        this.speech = null;
        this.onPlayerFinished.inform();
    }

    pause() {
        if (this.synth.speaking && !this.synth.paused) {
            this.synth.pause();
            this.isPaused = true;
        }
    }

    resume() {
        if (this.synth.paused) {
            this.synth.resume();
            this.isPaused = false;
        }
    }

    cancel() {
        this.synth.cancel();
        this.isPaused = false;
        this.onSpeakFinished();
    }


}