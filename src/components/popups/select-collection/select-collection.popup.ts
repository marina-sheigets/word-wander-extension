import { injectable } from "tsyringe";
import { CollectionsService } from "../../../services/collections/collections.service";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { CheckboxComponent } from "../../checkbox/checkbox.component";
import { ComponentsFactory } from "../../factories/component.factory.";
import { PopupComponent } from "../popup.component";
import * as styles from './select-collection.popup.css';
import { ButtonComponent } from "../../button/button.component";
import { AddNewCollectionInputComponent } from "../../input/add-new-collection/add-new-collection-input.component";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { Messages } from "../../../constants/messages";
import { HistoryItem } from "../../../types/History";
import { DictionaryService } from "../../../services/dictionary/dictionary.service";

@injectable()
export class SelectCollectionPopup extends PopupComponent {
    private content = document.createElement('div');
    private description = document.createElement('p');

    private checkboxesWrapper = document.createElement('div');
    private errorMessage = document.createElement('p');


    private word: string = "";
    private translation: string = "";

    constructor(
        protected i18n: I18nService,
        protected collectionsService: CollectionsService,
        protected componentsFactory: ComponentsFactory,
        protected saveButton: ButtonComponent,
        protected addCollectionButton: ButtonComponent,
        protected messenger: MessengerService,
        protected dictionaryService: DictionaryService
    ) {
        super(i18n);

        this.applyRootStyle(styles);

        this.setTitle(i18nKeys.SelectCollection);
        this.setDescription();

        this.saveButton.addButtonName(i18nKeys.Save);
        this.saveButton.disable();
        this.saveButton.onClick.subscribe(this.saveWordToCollections.bind(this));

        this.addCollectionButton.addButtonName(i18nKeys.AddNewCollection);
        this.addCollectionButton.rootElement.classList.add(styles.addCollectionButton);
        this.addCollectionButton.disable();
        this.addCollectionButton.onClick.subscribe(this.handleAddNewCollection.bind(this));

        this.content.classList.add(styles.content);
        this.checkboxesWrapper.classList.add(styles.checkboxesWrapper);
        this.errorMessage.classList.add(styles.errorMessage);

        this.initCheckboxes();

        this.content.append(
            this.description,
            this.checkboxesWrapper,
            this.saveButton.rootElement,
            this.addCollectionButton.rootElement,
            this.errorMessage
        );

        this.setContent(
            this.content
        );

        this.hide();

        this.messenger.subscribe(Messages.ShowSelectCollectionPopup, (item: HistoryItem) => {
            this.word = item.word;
            this.translation = item.translation;

            this.show();
        });
    }

    private setDescription() {
        this.i18n.follow(i18nKeys.SelectCollectionDescription, (value) => {
            this.description.textContent = value;
        });
    }

    private async initCheckboxes() {
        this.clearCheckboxesList();

        const listOfCollections: string[] = await this.collectionsService.getAllCollections();

        this.addDefaultCheckbox();

        listOfCollections.forEach(collectionName => {
            const checkboxRow = document.createElement('div');
            checkboxRow.classList.add(styles.checkboxRow);

            const label = document.createElement('label');
            label.textContent = collectionName;

            const checkbox = this.componentsFactory.createComponent(CheckboxComponent);
            checkbox.setName(collectionName);
            checkbox.onCheckboxChange.subscribe((value: boolean) => {
                checkbox.setChecked(value);
            });

            checkboxRow.append(
                checkbox.rootElement,
                label
            );

            this.checkboxesWrapper.append(
                checkboxRow
            );
        });

        this.saveButton.enable();
        this.addCollectionButton.enable();
    }

    private clearCheckboxesList() {
        this.errorMessage.textContent = "";
        this.checkboxesWrapper.textContent = "";
    }

    private addDefaultCheckbox() {
        const checkboxRow = document.createElement('div');
        checkboxRow.classList.add(styles.checkboxRow);

        const label = document.createElement('label');
        this.i18n.follow(i18nKeys.Default, (value) => {
            label.textContent = value;
        });

        const checkbox = this.componentsFactory.createComponent(CheckboxComponent);
        checkbox.setName(i18nKeys.Default);
        checkbox.setDisabled();
        checkbox.setChecked(true);

        checkboxRow.append(
            checkbox.rootElement,
            label
        );

        this.checkboxesWrapper.append(
            checkboxRow
        );
    }

    private handleAddNewCollection() {
        const newCollectionInput = this.componentsFactory.createComponent(AddNewCollectionInputComponent);

        this.checkboxesWrapper.append(newCollectionInput.rootElement);
    }

    private async saveWordToCollections() {
        const addedWord = await this.dictionaryService.addWordToDictionary(this.word, this.translation);

        if (!addedWord) {
            return;
        }

        this.errorMessage.textContent = "";

        const collectionsElements = this.checkboxesWrapper.querySelectorAll("input[type=text]");

        const names = Array.from(collectionsElements).map((element: HTMLInputElement) => element.value);
        const notEmptyCollectionsNames = names.filter((name) => name.trim().length);

        this.collectionsService.addWordToCollections(addedWord._id, notEmptyCollectionsNames)
            .then(() => {
                this.hide();
            }).catch(() => {
                this.i18n.follow(i18nKeys.SomethingWentWrong, (value) => {
                    this.errorMessage.textContent = value;
                });
            });
    }
}