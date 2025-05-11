import { injectable } from "tsyringe";
import { BaseComponent } from "../../base-component/base-component";
import * as styles from './collection.component.css';
import { DictionaryTableItem } from "../../../types/DictionaryTableItem";
import { ComponentsFactory } from "../../factories/component.factory.";
import { WordRowComponent } from "../../word-row/word-row.component";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { IconComponent } from "../../icon/icon.component";
import { IconName } from "../../../types/IconName";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { Messages } from "../../../constants/messages";
import { CollectionData } from "../../../types/CollectionData";

@injectable()
export class CollectionComponent extends BaseComponent {
    private header = document.createElement("div");

    private collectionTitle = document.createElement('h3');
    private collectionTools = document.createElement("div");

    private content = document.createElement("div");

    private collectionId: string = "";
    private collectionName: string = "";
    private collectionWords: DictionaryTableItem[] = []

    constructor(
        protected componentsFactory: ComponentsFactory,
        protected i18n: I18nService,
        protected changeCollectionNameButton: IconComponent,
        protected removeCollectionButton: IconComponent,
        protected collapseCollectionButton: IconComponent,
        protected messenger: MessengerService,
    ) {
        super(styles);

        this.header.classList.add(styles.header);
        this.content.classList.add(styles.content);
        this.collectionTools.classList.add(styles.collectionTools);

        this.header.append(
            this.collectionTitle,
            this.collectionTools
        );

        this.rootElement.append(
            this.header,
            this.content
        );

        this.collapse();
    }

    public setCollectionData(name: string, collectionData: CollectionData) {
        this.collectionName = name;
        this.collectionWords = collectionData.words;
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
        this.collapseCollectionButton.setIcon(IconName.ChevronDown);

        this.collapseCollectionButton.rootElement.addEventListener('click', () => {
            if (this.content.classList.contains(styles.collapsed)) {
                this.uncollapse();
            } else {
                this.collapse();
            }
        });


        this.collectionTools.append(this.collapseCollectionButton.rootElement);

        // cannot remove Default collection, so we cannot add remove button to it
        if (this.collectionName === 'Default') {
            return;
        }

        this.changeCollectionNameButton.setIcon(IconName.Edit);
        this.changeCollectionNameButton.rootElement.addEventListener('click', () => {
            this.messenger.send(
                Messages.ShowChangeCollectionNamePopup,
                { collectionId: this.collectionId, name: this.collectionName });
        });

        this.removeCollectionButton.setIcon(IconName.Delete);
        this.removeCollectionButton.rootElement.addEventListener('click', () => {
            this.messenger.send(Messages.ShowRemoveCollectionPopup, { collectionId: this.collectionId });
        });

        this.collectionTools.prepend(this.changeCollectionNameButton.rootElement, this.removeCollectionButton.rootElement);
    }

    private initContent() {
        if (this.collectionName === 'Default') {
            this.uncollapse();
        }

        this.collectionWords.forEach((wordObj) => {
            const wordRowComponent = this.componentsFactory.createComponent(WordRowComponent);
            wordRowComponent.setWord(wordObj);

            this.content.append(wordRowComponent.rootElement);
        })
    }

    collapse() {
        this.collapseCollectionButton.rootElement.classList.remove(styles.arrowUp);
        this.content.classList.add(styles.collapsed);
    }

    uncollapse() {
        this.collapseCollectionButton.rootElement.classList.add(styles.arrowUp);
        this.content.classList.remove(styles.collapsed);
    }
}