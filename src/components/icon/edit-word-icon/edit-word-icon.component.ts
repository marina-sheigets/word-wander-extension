import { injectable } from "tsyringe";
import { Messages } from "../../../constants/messages";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { DictionaryTableItem } from "../../../types/DictionaryTableItem";
import { IconName } from "../../../types/IconName";
import { IconComponent } from "../icon.component";
import * as styles from './edit-word-icon.component.css';

@injectable()
export class EditWordIconComponent extends IconComponent {

    private word: DictionaryTableItem | null = null;

    constructor(
        protected messenger: MessengerService
    ) {
        super();

        this.applyRootStyle(styles);

        this.setIcon(IconName.Edit);

        this.rootElement.addEventListener('click', () => {
            this.messenger.send(Messages.ShowEditWordPopup, this.word);
        });
    }

    setWord(word: DictionaryTableItem) {
        this.word = word;
    }
}