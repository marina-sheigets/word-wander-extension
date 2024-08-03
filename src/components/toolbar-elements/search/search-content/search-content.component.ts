import { singleton } from "tsyringe";
import { BaseComponent } from "../../../base-component/base-component";
import * as styles from './search-content.component.css'
import { WordTranslationComponent } from "../../../word-translation/word-translation.component";
import { Dictionary } from "../../../../types/Dictionary";

@singleton()
export class SearchContentComponent extends BaseComponent {

    constructor(
        protected wordTranslationComponent: WordTranslationComponent,
    ) {
        super(styles);

        this.hide();
    }

    fillWithData(word: string, translations: string[], dictionaryResponse: Dictionary[]) {
        this.clearData();

        translations.forEach((translation) => {
            this.wordTranslationComponent.addPair(word, translation);
        });

        this.rootElement.append(this.wordTranslationComponent.rootElement);

        if (dictionaryResponse) {
            dictionaryResponse.forEach((item) => {
                this.processDictionaryItem(item);
            });
        }
    }

    private processDictionaryItem(item: Dictionary) {
        const wordMeaningTitle = document.createElement('h3');
        const wordUsageTitle = document.createElement('h3');
        const synonymsTitle = document.createElement('h3');

        wordMeaningTitle.textContent = 'Meaning';
        wordUsageTitle.textContent = 'Usage';
        synonymsTitle.textContent = 'Synonyms';

        const wordMeaningComponent = document.createElement('div');
        const wordUsageComponent = document.createElement('div');
        const synonymsComponent = document.createElement('div');

        wordMeaningComponent.classList.add(styles.wordMeaning);
        wordUsageComponent.classList.add(styles.wordUsage);
        synonymsComponent.classList.add(styles.synonyms);

        const processPartOfSpeech = (partOfSpeech: { meaning: string[], usage: string[] }, partOfSpeechName: string) => {
            if (partOfSpeech.meaning.length > 1) {
                partOfSpeech.meaning = partOfSpeech.meaning.slice(0, 1);
            }

            if (partOfSpeech.meaning.length > 0) {
                partOfSpeech.meaning.forEach((meaning) => {
                    const p = document.createElement('p');
                    p.textContent = `-${partOfSpeechName} : ` + meaning;
                    wordMeaningComponent.append(p);
                });

                this.rootElement.append(wordMeaningTitle, wordMeaningComponent);
            }

            if (partOfSpeech.usage.length > 0) {
                partOfSpeech.usage.forEach((usage) => {
                    const p = document.createElement('div');
                    p.textContent = usage;
                    wordUsageComponent.append(p);
                });

                this.rootElement.append(wordUsageTitle, wordUsageComponent);
            }
        };

        if (item.noun) {
            processPartOfSpeech(item.noun, 'noun');
        }

        if (item.adjective) {
            processPartOfSpeech(item.adjective, 'adjective');
        }

        if (item.verb) {
            processPartOfSpeech(item.verb, 'verb');
        }

        if (item.interjection) {
            processPartOfSpeech(item.interjection, 'interjection');
        }

        if (item.synonyms) {
            synonymsComponent.textContent = item.synonyms.flat().join(', ');
            if (synonymsComponent.textContent.length > 0) {
                this.rootElement.append(synonymsTitle, synonymsComponent);
            }
        }


    }


    clearData() {
        this.wordTranslationComponent.clear();
        this.rootElement.innerHTML = '';
    }

    show() {
        this.rootElement.classList.remove(styles.hidden);
    }

    hide() {
        this.rootElement.classList.add(styles.hidden);
    }
}