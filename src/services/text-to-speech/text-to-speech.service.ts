import { singleton } from "tsyringe";
import { SettingsService } from "../settings/settings.service";
import { Informer } from "../informer/informer.service";
import { SettingsNames } from "../../constants/settingsNames";
import { UserStatisticsService } from "../user-statistics/user-statistics.service";
import { StatisticsPath } from "../../constants/statisticsPaths";

@singleton()
export class TextToSpeechService {
    private synth: SpeechSynthesis;
    private voices: SpeechSynthesisVoice[] = [];
    private speech: SpeechSynthesisUtterance | null = null;
    public onPlayerFinished = new Informer();
    public isPaused = false;
    private voice: SpeechSynthesisVoice | null = null;

    constructor(
        protected settingsService: SettingsService,
        protected userStatisticsService: UserStatisticsService
    ) {
        this.synth = window.speechSynthesis;
        this.synth.onvoiceschanged = this.setVoices.bind(this);

        this.settingsService.subscribe(SettingsNames.Voice, (selectedVoice: string) => {
            this.voice = this.voices.find(voice => voice.voiceURI === selectedVoice) || this.voices[0];
        });
    }

    setVoices() {
        this.voices = this.synth.getVoices();

        const voicesUris =
            this.voices.map(voice => voice.voiceURI)
                .filter(uri => uri.toLowerCase().includes('english'));

        this.voice = this.voices.find(voice => voice.voiceURI === this.settingsService.get(SettingsNames.Voice)) || this.voices[0];

        this.settingsService.set(SettingsNames.Voices, voicesUris);
    }

    getVoices() {
        return this.voices;
    }

    play(text: string) {
        if (!this.voice) {
            alert("Something went wrong. Please, try again later");
            return;
        }

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
        this.speech.rate = +this.settingsService.get(SettingsNames.PronunciationSpeed);
        this.speech.voice = this.voice;

        this.speech.addEventListener('end', this.onSpeakFinished.bind(this));
        this.speech.addEventListener('error', this.onSpeakFinished.bind(this));

        this.synth.speak(this.speech);
        this.isPaused = false;

        this.userStatisticsService.updateStatistics({ fieldPath: StatisticsPath.TOTAL_PRONOUNCED_WORDS });
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