import { injectable } from "tsyringe";
import { DictionaryService } from "../../../services/dictionary/dictionary.service";
import { DictionaryTableItem } from "../../../types/DictionaryTableItem";
import { IconName } from "../../../types/IconName";
import { IconComponent } from "../icon.component";
import * as styles from './remove-word-icon.component.css';

@injectable()
export class RemoveWordIconComponent extends IconComponent {
    private word: DictionaryTableItem | null = null;
    constructor(
        protected dictionaryService: DictionaryService
    ) {
        super();

        this.applyRootStyle(styles);

        this.setIcon(IconName.Delete);

        this.rootElement.addEventListener('click', () => {
            this.dictionaryService.removeWordFromDictionary(this.word?._id || '');
        });
    }

    setWord(word: DictionaryTableItem) {
        this.word = word;
    }
}