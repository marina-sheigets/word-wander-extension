import { singleton } from "tsyringe";
import { i18nKeys } from "../../services/i18n/i18n-keys";
import { BaseComponent } from "../base-component/base-component";
import { ButtonComponent } from "../button/button.component";
import * as styles from './dictionary-tools.component.css';
import { DictionaryService } from "../../services/dictionary/dictionary.service";
import { Messages } from "../../constants/messages";
import { MessengerService } from "../../services/messenger/messenger.service";
import { Informer } from "../../services/informer/informer.service";

@singleton()
export class DictionaryToolsComponent extends BaseComponent {
    public onUnselectAllWords = new Informer();

    constructor(
        protected unselectAllWordsButton: ButtonComponent,
        protected removeSelectedWordsButton: ButtonComponent,
        protected sendOnTrainingButton: ButtonComponent,
        protected dictionaryService: DictionaryService,
        protected messengerService: MessengerService
    ) {
        super(styles);

        this.unselectAllWordsButton.addButtonName(i18nKeys.UnselectAll);
        this.unselectAllWordsButton.onClick.subscribe(this.unselectAllWords.bind(this));

        this.removeSelectedWordsButton.addButtonName(i18nKeys.RemoveSelectedWords);
        this.removeSelectedWordsButton.onClick.subscribe(this.removeSelectedWords.bind(this));

        this.sendOnTrainingButton.addButtonName(i18nKeys.SendOnTraining);
        this.sendOnTrainingButton.onClick.subscribe(this.sendOnTraining.bind(this));

        this.rootElement.append(
            this.unselectAllWordsButton.rootElement,
            this.sendOnTrainingButton.rootElement,
            this.removeSelectedWordsButton.rootElement
        );

        this.dictionaryService.onSelectedWordsChanged.subscribe(this.toggleToolsVisibility.bind(this));

        this.hide();
    }

    private unselectAllWords() {
        this.onUnselectAllWords.inform();
    }

    private removeSelectedWords() {
        this.dictionaryService.removeWordsFromDictionary(this.dictionaryService.getSelectedWordsIds());
    }

    private sendOnTraining() {
        this.messengerService.send(Messages.SendWordsOnTrainingPopup);
    }

    private toggleToolsVisibility(data: string[]) {
        if (data.length) {
            this.show();
        } else {
            this.hide();
        }
    }

    private hide() {
        this.rootElement.classList.add(styles.hidden);
    }

    private show() {
        this.rootElement.classList.remove(styles.hidden);
    }
}