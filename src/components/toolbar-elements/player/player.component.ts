import { singleton } from "tsyringe";
import { BaseComponent } from "../../base-component/base-component";
import { ToolbarButtonComponent } from "../../toolbar-button/toolbar-button.component";
import * as styles from './player.component.css'
import { TextToSpeechService } from "../../../services/text-to-speech/text-to-speech.service";
import { TextManagerService } from "../../../services/text-manager/text-manager.service";
import { NotFoundPopupComponent } from "../../popups/not-found/not-found.component";
import { PermissionsService } from "../../../services/permissions/permissions.service";
import { IconName } from "../../../types/IconName";
import { i18nKeys } from "../../../services/i18n/i18n-keys";

@singleton()
export class PlayerComponent extends BaseComponent {

    constructor(
        protected playButton: ToolbarButtonComponent,
        protected pauseButton: ToolbarButtonComponent,
        protected resumeButton: ToolbarButtonComponent,
        protected textToSpeechService: TextToSpeechService,
        protected textManager: TextManagerService,
        protected notFoundPopup: NotFoundPopupComponent,
        protected permissions: PermissionsService
    ) {
        super(styles);

        this.playButton.addIcon(IconName.Play);
        this.playButton.addTooltip(i18nKeys.Play);
        this.playButton.onPress.subscribe(() => {
            this.playText();
        });

        this.pauseButton.addIcon(IconName.Pause);
        this.pauseButton.addTooltip(i18nKeys.Pause);
        this.pauseButton.onPress.subscribe(this.pausePlay.bind(this));

        this.resumeButton.addIcon(IconName.Play);
        this.resumeButton.addTooltip(i18nKeys.Resume);
        this.resumeButton.onPress.subscribe(this.resumePlay.bind(this));

        this.pauseButton.rootElement.classList.add(styles.hidden);
        this.resumeButton.rootElement.classList.add(styles.hidden);

        this.rootElement.append(
            this.playButton.rootElement,
            this.pauseButton.rootElement,
            this.resumeButton.rootElement
        );

        this.textToSpeechService.onPlayerFinished.subscribe(this.finishSpeech.bind(this));

        document.addEventListener('dblclick', (e: Event) => {
            const element = e.target as HTMLElement;

            if (element.nodeName === 'WORD-WANDER') {
                return;
            }

            if (this.permissions.isPronounceWithDoubleClickedEnabled()) {
                this.playText();
            }
        });

    }

    playText() {
        const text = this.textManager.getSelectedTextOnPage();

        if (!text.trim()) {
            this.notFoundPopup.show();
            return;
        }

        this.pauseButton.rootElement.classList.remove(styles.hidden);
        this.playButton.rootElement.classList.add(styles.hidden);

        this.textToSpeechService.play(text);
    }

    pausePlay() {
        this.playButton.rootElement.classList.add(styles.hidden);
        this.resumeButton.rootElement.classList.remove(styles.hidden);
        this.pauseButton.rootElement.classList.add(styles.hidden);
        this.textToSpeechService.pause();

        document.addEventListener('selectionchange', this.interruptPlay.bind(this));

    }

    interruptPlay() {
        document.removeEventListener('selectionchange', this.interruptPlay.bind(this));
        this.textToSpeechService.cancel();
        this.finishSpeech.bind(this)
    }

    resumePlay() {
        this.resumeButton.rootElement.classList.add(styles.hidden);
        this.pauseButton.rootElement.classList.remove(styles.hidden);
        this.textToSpeechService.resume();
    }

    finishSpeech() {
        this.pauseButton.rootElement.classList.add(styles.hidden);
        this.resumeButton.rootElement.classList.add(styles.hidden);
        this.playButton.rootElement.classList.remove(styles.hidden);
    }
}