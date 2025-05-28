import { injectable } from "tsyringe";
import { BaseComponent } from "../../base-component/base-component";
import * as styles from './collection.component.css';
import { DictionaryTableItem } from "../../../types/DictionaryTableItem";
import { ComponentsFactory } from "../../factories/component.factory.";
import { WordRowComponent } from "../../word-row/word-row.component";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { CollectionData } from "../../../types/CollectionData";
import { DictionaryService } from "../../../services/dictionary/dictionary.service";
import { CollectionToolsComponent } from "./collection-tools/collection-tools.component";

@injectable()
export class CollectionComponent extends BaseComponent {
    private header = document.createElement("div");

    private collectionTitle = document.createElement('h3');

    private content = document.createElement("div");

    private collectionId: string = "";
    private collectionName: string = "";
    private initialWords: DictionaryTableItem[] = [];
    private words: DictionaryTableItem[] = []

    constructor(
        protected componentsFactory: ComponentsFactory,
        protected i18n: I18nService,
        protected dictionaryService: DictionaryService,
        protected collectionTools: CollectionToolsComponent,
    ) {
        super(styles);

        this.header.classList.add(styles.header);
        this.content.classList.add(styles.content);

        this.header.append(
            this.collectionTitle,
            this.collectionTools.rootElement
        );

        this.rootElement.append(
            this.header,
            this.content
        );

        this.collectionTools.onCollectionCollapsed.subscribe((isCollapsed) => {
            if (isCollapsed) {
                this.content.classList.add(styles.collapsed);
            } else {
                this.content.classList.remove(styles.collapsed);
            }
        })

    }

    public setCollectionData(name: string, collectionData: CollectionData) {
        this.collectionName = name;
        this.initialWords = collectionData.words;
        this.words = collectionData.words;
        this.collectionId = collectionData.collectionId;

        this.initCollectionName();
        this.initTools();
        this.initContent();
    }

    private initCollectionName() {
        if (this.collectionName === i18nKeys.Default) {
            this.i18n.follow(i18nKeys.Default, (value) => {
                this.collectionTitle.textContent = value;
            });

            return;
        }

        this.collectionTitle.textContent = this.collectionName;
    }

    private initTools() {
        this.collectionTools.initTools(this.collectionId, this.collectionName);
    }

    private initContent() {
        this.words.forEach((wordObj) => {
            const wordRowComponent = this.componentsFactory.createComponent(WordRowComponent);
            wordRowComponent.setWord(wordObj);
            wordRowComponent.updateTableDataSelected.subscribe(this.updateTableDataSelected.bind(this));

            this.content.append(wordRowComponent.rootElement);
        })
    }

    protected updateTableDataSelected(checkbox: HTMLInputElement) {
        const selectedId = checkbox.name;

        this.words.forEach((item) => {
            if (item._id === selectedId) {
                item.selected = checkbox.checked;
            }
        });

        this.initialWords.forEach((item) => {
            if (item._id === selectedId) {
                item.selected = checkbox.checked;
            }
        });

        this.toggleSelectedWordIdsInDictionaryService(checkbox.checked, [selectedId]);
    }

    private toggleSelectedWordIdsInDictionaryService(checked: boolean, selectedIds: string[]) {
        if (checked) {
            this.dictionaryService.addSelectedWords(selectedIds);
        } else {
            this.dictionaryService.filterUnselectedWords(selectedIds);
        }
    }
}