import { singleton } from "tsyringe";
import { BaseComponent } from "../../base-component/base-component";
import { ToolbarButtonComponent } from "../../toolbar-button/toolbar-button.component";
import * as styles from './player.component.css'
import { TextToSpeechService } from "../../../services/voices/text-to-speach.service";
import { TextManagerService } from "../../../services/text-manager/text-manager.service";
import { NotFoundPopupComponent } from "../../popups/not-found/not-found.component";

@singleton()
export class PlayerComponent extends BaseComponent {

    constructor(
        protected button: ToolbarButtonComponent,
        protected textToSpeechService: TextToSpeechService,
        protected textManager: TextManagerService,
        protected notFoundPopup: NotFoundPopupComponent
    ) {
        super(styles);

        this.button.addIcon('play_circle');

        this.button.onPress.subscribe(this.playText.bind(this));

        this.rootElement.append(
            button.rootElement
        );
    }

    playText() {
        const text = this.textManager.getSelectedTextOnPage();

        if (!text) {
            this.notFoundPopup.show();
            return;
        }

        this.textToSpeechService.play(text);
    }
}