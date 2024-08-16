import { singleton } from "tsyringe";
import { BaseComponent } from "../../../base-component/base-component";
import * as styles from './search-content.component.css'
import { WordTranslationComponent } from "../../../word-translation/word-translation.component";
import { Dictionary } from "../../../../types/Dictionary";
import { SettingsService } from "../../../../services/settings/settings.service";
import { PermissionsService } from "../../../../services/permissions/permissions.service";
import { ButtonComponent } from "../../../button/button.component";
import { TextToSpeechService } from "../../../../services/text-to-speech/text-to-speech.service";
import { Informer } from "../../../../services/informer/informer.service";
import { DictionaryService } from "../../../../services/dictionary/dictionary.service";
import { i18nKeys } from "../../../../services/i18n/i18n-keys";

@singleton()
export class SearchContentComponent extends BaseComponent {
    private word: string = '';
    private translations: string[] = [];
    private controlsWrapper = document.createElement('div');
    public onClear = new Informer<void>();

    constructor(
        protected wordTranslationComponent: WordTranslationComponent,
        protected settings: SettingsService,
        protected clearButton: ButtonComponent,
        protected saveToDictionaryButton: ButtonComponent,
        protected pronounceButton: ButtonComponent,
        protected permissions: PermissionsService,
        protected textToSpeechService: TextToSpeechService,
        protected dictionaryService: DictionaryService
    ) {
        super(styles);

        this.clearButton.addButtonIcon('clear');
        this.pronounceButton.addTooltip('Clear results');
        this.clearButton.onClick.subscribe(() => {
            this.onClear.inform();
            this.clearData()
        });

        this.pronounceButton.addButtonIcon('music_note');
        this.pronounceButton.addTooltip('Pronounce');
        this.pronounceButton.onClick.subscribe(this.pronounceWord.bind(this));

        this.saveToDictionaryButton.addButtonName(i18nKeys.SaveToDictionary);
        this.saveToDictionaryButton.rootElement.classList.add(styles.saveToDictionaryButton);
        this.saveToDictionaryButton.onClick.subscribe(() => {
            this.dictionaryService.addWordToDictionary(this.word, this.translations);
        });

        this.controlsWrapper = document.createElement('div');
        this.controlsWrapper.classList.add(styles.controlsWrapper);

        this.controlsWrapper.append(
            this.saveToDictionaryButton.rootElement,
            this.clearButton.rootElement,
            this.pronounceButton.rootElement
        );

        this.hide();
    }

    fillWithData(word: string, translations: string[], dictionaryResponse: Dictionary[]) {
        this.clearData();
        this.word = word;
        this.translations = translations;

        translations.forEach((translation) => {
            this.wordTranslationComponent.addPair(word, translation);
        });

        this.rootElement.append(this.controlsWrapper);
        this.rootElement.append(this.wordTranslationComponent.rootElement);

        if (dictionaryResponse) {
            dictionaryResponse.forEach((item) => {
                this.processDictionaryItem(item);
            });
        }
    }

    private processDictionaryItem(item: Dictionary) {
        const hr = document.createElement('hr');

        const titles = {
            wordMeaning: this.createTitle('Meaning'),
            wordUsage: this.createTitle('Usage'),
            synonyms: this.createTitle('Synonyms')
        };

        const components = {
            wordMeaning: this.createComponent(styles.wordMeaning),
            wordUsage: this.createComponent(styles.wordUsage),
            synonyms: this.createComponent(styles.synonyms)
        };

        const processPartOfSpeech = (partOfSpeech: { meaning: string[], usage: string[] }, partOfSpeechName: string) => {
            this.processMeanings(partOfSpeech.meaning, partOfSpeechName, components.wordMeaning);
            this.processUsages(partOfSpeech.usage, components.wordUsage);
        };

        if (item.noun) processPartOfSpeech(item.noun, 'noun');
        if (item.adjective) processPartOfSpeech(item.adjective, 'adjective');
        if (item.verb) processPartOfSpeech(item.verb, 'verb');
        if (item.interjection) processPartOfSpeech(item.interjection, 'interjection');

        this.processSynonyms(item.synonyms, components.synonyms);

        this.rootElement.append(hr);
        this.appendToRoot(titles.wordMeaning, components.wordMeaning);
        this.appendToRoot(titles.wordUsage, components.wordUsage);
        this.appendToRoot(titles.synonyms, components.synonyms);
    }

    private createTitle(text: string): HTMLHeadingElement {
        const title = document.createElement('h3');
        title.textContent = text;
        return title;
    }

    private createComponent(className: string): HTMLDivElement {
        const component = document.createElement('div');
        component.classList.add(className);
        return component;
    }

    private processMeanings(meanings: string[], partOfSpeechName: string, component: HTMLDivElement) {
        if (meanings.length > 1) {
            meanings = meanings.slice(0, 1);
        }

        if (meanings.length > 0) {
            meanings.forEach((meaning) => {
                const p = document.createElement('p');
                p.textContent = `-${partOfSpeechName} : ` + meaning;
                component.append(p);
            });
        }
    }

    private processUsages(usages: string[], component: HTMLDivElement) {
        if (usages.length > 0 && this.permissions.isUsageEnabled()) {
            usages.forEach((usage) => {
                const p = document.createElement('div');
                p.textContent = usage;
                component.append(p);
            });
        }
    }

    private processSynonyms(synonyms: string[][], component: HTMLDivElement) {
        if (synonyms && this.permissions.isSynonymsEnabled()) {
            component.textContent = synonyms.flat().join(', ');
        }
    }

    private appendToRoot(title: HTMLHeadingElement, component: HTMLDivElement) {
        if (component.textContent && component.textContent.length > 0) {
            this.rootElement.append(title, component);
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

    pronounceWord() {
        this.textToSpeechService.play(this.word);
    }
}