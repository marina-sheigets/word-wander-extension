import { singleton } from "tsyringe";
import { Messages } from "../../../constants/messages";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { InputComponent } from "../../input/input.component";
import { PopupComponent } from "../popup.component";
import * as styles from './edit-collection.popup.css';
import { ButtonComponent } from "../../button/button.component";
import { CollectionsService } from "../../../services/collections/collections.service";
import { DictionaryService } from "../../../services/dictionary/dictionary.service";

@singleton()
export class EditCollectionPopup extends PopupComponent {
    private content = document.createElement('div');
    private errorMessage = document.createElement('div');

    protected collection: { name: string, collectionId: string } | null = null;

    constructor(
        protected i18n: I18nService,
        protected collectionNameInput: InputComponent,
        protected saveButton: ButtonComponent,
        protected messenger: MessengerService,
        protected collectionsService: CollectionsService,
        protected dictionaryService: DictionaryService
    ) {
        super(i18n);

        this.setTitle(i18nKeys.EditCollection);
        this.setWidth("300px");

        this.content.classList.add(styles.content);
        this.saveButton.rootElement.classList.add(styles.saveButton);

        this.content.append(
            this.collectionNameInput.rootElement,
            this.saveButton.rootElement,
            this.errorMessage
        );

        this.setContent(this.content);


        this.collectionNameInput.setLabel(i18nKeys.EnterNewCollectionName);
        this.saveButton.addButtonName(i18nKeys.Save);

        this.hide();

        this.messenger.subscribe(Messages.ShowChangeCollectionNamePopup, (collection: { name: string, collectionId: string }) => {
            this.clearError();

            this.collection = collection;

            this.initInput();

            this.show();
        });

        this.saveButton.onClick.subscribe(this.handleEditCollection.bind(this));
    }

    private initInput() {
        if (!this.collection) {
            return;
        }

        this.collectionNameInput.input.value = this.collection.name;

        this.saveButton.disable();

        const updateButtonState = () => {
            const collectionNameValue = this.collectionNameInput.getValue().trim();

            const collectionNameIsNotEmpty = collectionNameValue.length === 0;

            const collectionNameIsUnchanged = this.collection && collectionNameValue === this.collection.name;

            if (collectionNameIsUnchanged || collectionNameIsNotEmpty) {
                this.saveButton.disable();
            } else {
                this.saveButton.enable();
            }
        };

        this.collectionNameInput.onChange.subscribe(() => updateButtonState());
    }

    private handleEditCollection() {
        this.collectionsService.editCollection({
            collectionId: this.collection?.collectionId || "",
            name: this.collectionNameInput.getValue().trim()
        }
        ).then(() => {
            this.dictionaryService.rerenderDictionary('', '');
            this.hide();
        }).then(() => {
            this.i18n.follow(i18nKeys.SomethingWentWrong, (value) => {
                this.errorMessage.textContent = value;
            })
        });
    }

    private clearError() {
        this.errorMessage.textContent = '';
    }

}