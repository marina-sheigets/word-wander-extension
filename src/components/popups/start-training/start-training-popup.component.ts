import { singleton } from "tsyringe";
import { Messages } from "../../../constants/messages";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { ButtonComponent } from "../../button/button.component";
import { PopupComponent } from "../popup.component";
import * as styles from './start-training-popup.component.css';
import { TrainingsService } from "../../../services/trainings/trainings.service";

@singleton()
export class StartTrainingPopup extends PopupComponent {
    private content = document.createElement('div');
    private description = document.createElement('p');
    private gameID: null | number = null;

    constructor(
        protected i18n: I18nService,
        protected yesButton: ButtonComponent,
        protected messenger: MessengerService,
        protected trainingService: TrainingsService
    ) {
        super(i18n);

        this.content.classList.add(styles.content);

        i18n.follow(i18nKeys.StartTrainingDescription, (value) => {
            this.description.textContent = value;
        });

        this.setTitle(i18nKeys.StartTrainingTitle);

        this.yesButton.addButtonName(i18nKeys.Yes);
        this.yesButton.onClick.subscribe(() => {
            this.showTrainingPopup();
        });
        this.content.append(
            this.description,
            this.yesButton.rootElement
        );
        this.setContent(this.content);

        this.hide();

        this.messenger.subscribe(Messages.ShowStartTrainingPopup, (gameID: number) => {
            this.gameID = gameID;
            this.show();
        });
    }

    private showTrainingPopup() {
        this.hide();
        this.trainingService.startGame(this.gameID as number);
    }
}