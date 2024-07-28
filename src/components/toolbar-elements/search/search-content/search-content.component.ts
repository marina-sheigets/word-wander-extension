import { singleton } from "tsyringe";
import { BaseComponent } from "../../../base-component/base-component";
import * as styles from './search-content.component.css'
import { WordTranslationComponent } from "../../../word-translation/word-translation.component";
import { WordMeaningComponent } from "../../../word-meaning/word-meaning.component";
import { WordUsageComponent } from "../../../word-usage/word-usage.component";
import { SynonymsComponent } from "../../../synonyms/synonyms.component";

interface TranslationData {
    translation: string,
    synonyms: string[],
    meaning: string,
    usage: string[]
}


@singleton()
export class SearchContentComponent extends BaseComponent {

    constructor(
        protected wordTranslationComponent: WordTranslationComponent,
        protected wordMeaningComponent: WordMeaningComponent,
        protected wordUsageComponent: WordUsageComponent,
        protected synonymsComponent: SynonymsComponent
    ) {
        super(styles);

        this.rootElement.append(
            this.wordTranslationComponent.rootElement,
            this.wordMeaningComponent.rootElement,
            this.wordUsageComponent.rootElement,
            this.synonymsComponent.rootElement
        );

        this.hide();
    }

    fillWithData(word: string, data: TranslationData) {
        if (data.translation) {
            this.wordTranslationComponent.show();
            this.wordTranslationComponent.addPair(word, data.translation);
        }

        if (data.meaning) {
            this.wordMeaningComponent.addMeaning(data.meaning);
            this.wordMeaningComponent.show();
        }

        if (data.usage) {
            this.wordUsageComponent.addExamples(data.usage);
            this.wordUsageComponent.show();
        }

        if (data.synonyms) {
            this.synonymsComponent.addSynonyms(data.synonyms);
            this.synonymsComponent.show();
        }
    }

    clearData() {
        this.wordTranslationComponent.clear();
        this.wordMeaningComponent.clear();
        this.wordUsageComponent.clear();
        this.synonymsComponent.clear();
    }

    show() {
        this.rootElement.classList.remove(styles.hidden);
    }

    hide() {
        this.rootElement.classList.add(styles.hidden);
    }
}