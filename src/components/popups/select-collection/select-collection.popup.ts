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

@injectable()
export class SelectCollectionPopup extends PopupComponent {
    private content = document.createElement('div');
    private description = document.createElement('p');

    private checkboxesWrapper = document.createElement('div');

    constructor(
        protected i18n: I18nService,
        protected collectionsService: CollectionsService,
        protected componentsFactory: ComponentsFactory,
        protected saveButton: ButtonComponent,
        protected addCollectionButton: ButtonComponent,
    ) {
        super(i18n);

        this.applyRootStyle(styles);

        this.setTitle(i18nKeys.SelectCollection);
        this.setDescription();

        this.saveButton.addButtonName(i18nKeys.Save);
        this.saveButton.disable();

        this.addCollectionButton.addButtonName(i18nKeys.AddNewCollection);
        this.addCollectionButton.rootElement.classList.add(styles.addCollectionButton);
        this.addCollectionButton.disable();
        this.addCollectionButton.onClick.subscribe(this.handleAddNewCollection.bind(this));

        this.content.classList.add(styles.content);
        this.checkboxesWrapper.classList.add(styles.checkboxesWrapper);

        this.initCheckboxes();

        this.content.append(
            this.description,
            this.checkboxesWrapper,
            this.saveButton.rootElement,
            this.addCollectionButton.rootElement
        );

        this.setContent(
            this.content
        )
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
}