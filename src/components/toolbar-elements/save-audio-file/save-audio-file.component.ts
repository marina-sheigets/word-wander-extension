import { singleton } from "tsyringe";
import { BaseComponent } from "../../base-component/base-component";
import * as styles from './save-audio-file.component.css';
import { ToolbarButtonComponent } from "../../toolbar-button/toolbar-button.component";
import { IconName } from "../../../types/IconName";
import { TextToSpeechService } from "../../../services/text-to-speech/text-to-speech.service";
import { TextManagerService } from "../../../services/text-manager/text-manager.service";
import { NotFoundPopupComponent } from "../../popups/not-found/not-found.component";
import { i18nKeys } from "../../../services/i18n/i18n-keys";

@singleton()
export class SaveAsAudioFileComponent extends BaseComponent {

    constructor(
        protected saveAudioFileButton: ToolbarButtonComponent,
        protected textToSpeechService: TextToSpeechService,
        protected textManager: TextManagerService,
        protected notFoundPopup: NotFoundPopupComponent,

    ) {
        super(styles);

        this.saveAudioFileButton.addIcon(IconName.DownloadAudioFile);
        this.saveAudioFileButton.addTooltip(i18nKeys.DownloadAudioFile);

        this.rootElement.append(
            this.saveAudioFileButton.rootElement
        )
    }
}