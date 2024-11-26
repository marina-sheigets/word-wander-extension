import { singleton } from "tsyringe";
import { Messages } from "../../../constants/messages";
import { trainings } from "../../../constants/trainings";
import { DictionaryService } from "../../../services/dictionary/dictionary.service";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { Training } from "../../../types/Training";
import { ButtonComponent } from "../../button/button.component";
import { CheckboxComponent } from "../../checkbox/checkbox.component";
import { LoaderComponent } from "../../loader/loader.component";
import { PopupComponent } from "../popup.component";
import * as styles from "./send-words-on-training-popup.component.css";

@singleton()
export class SendWordsOnTrainingPopup extends PopupComponent {
    private content = document.createElement('div');
    private description = document.createElement('p');
    private checkboxesWrapper = document.createElement('div');


    private trainingData: Array<Training & { selected: boolean }> = [];

    constructor(
        protected i18n: I18nService,
        protected sendButton: ButtonComponent,
        protected messenger: MessengerService,
        protected dictionaryService: DictionaryService,
        protected loader: LoaderComponent
    ) {
        super(styles);


        this.setTitle(i18nKeys.SendWordsOnTrainingTitle);

        i18n.follow(i18nKeys.SendWordsOnTrainingDescription, (value) => {
            this.description.textContent = value;
        });
        this.content.classList.add(styles.content);
        this.checkboxesWrapper.classList.add(styles.checkboxesWrapper);

        this.sendButton.addButtonName(i18nKeys.Send);
        this.sendButton.onClick.subscribe(this.handleSendWords.bind(this));

        this.content.append(
            this.description,
            this.checkboxesWrapper,
            this.loader.rootElement,
            this.sendButton.rootElement,
        );

        this.setContent(this.content);

        this.loader.hide();
        this.hide();

        this.messenger.subscribe(Messages.SendWordsOnTrainingPopup, () => {
            this.initTrainingCheckboxes();
            this.show();
        });
    }

    private initTrainingCheckboxes() {
        this.trainingData = trainings.map(item => ({ ...item, selected: false }));

        this.trainingData.forEach((training) => {
            const checkbox = new CheckboxComponent(training.name);

            checkbox.onCheckboxChange.subscribe((value: boolean) => {
                this.trainingData = this.trainingData.map((item) => item.name === training.name ? { ...item, selected: value } : item);
            });

            const label = document.createElement('label');
            this.i18n.follow(training.title, (value) => {
                label.textContent = value;
            });

            label.prepend(checkbox.rootElement);

            this.checkboxesWrapper.append(label);
        });
    }

    private async handleSendWords() {
        const selectedWords = this.dictionaryService.getDictionaryData().filter((item) => item.selected);
        const selectedWordsIds = selectedWords.map((item) => item.id);
        const selectedTrainings = this.trainingData.filter((item) => item.selected);

        const selectedTrainingsNames = selectedTrainings.map((item) => item.name);

        this.loader.show();
        this.sendButton.hide();

        this.dictionaryService.addWordsToTrainings(selectedWordsIds, selectedTrainingsNames)
            .then(() => {
                this.i18n.follow(i18nKeys.Done, (value) => {
                    this.content.textContent = value;
                });
            })
            .catch((e) => {
                console.error(e);
                this.i18n.follow(i18nKeys.SomethingWentWrong, (value) => {
                    this.content.textContent = value;
                });
            })
            .finally(() => {
                this.loader.hide();
                this.sendButton.show();
            })
    }
}