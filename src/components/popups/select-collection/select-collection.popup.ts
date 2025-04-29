import { injectable } from "tsyringe";
import { CollectionsService } from "../../../services/collections/collections.service";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { CheckboxComponent } from "../../checkbox/checkbox.component";
import { ComponentsFactory } from "../../factories/component.factory.";
import { PopupComponent } from "../popup.component";
import * as styles from './select-collection.popup.css';
@injectable()
export class SelectCollectionPopup extends PopupComponent {
    private content = document.createElement('div');
    private description = document.createElement('p');

    private checkboxesWrapper = document.createElement('div');

    constructor(
        protected i18n: I18nService,
        protected collectionsService: CollectionsService,
        protected componentsFactory: ComponentsFactory
    ) {
        super(i18n);

        this.applyRootStyle(styles);

        this.setTitle(i18nKeys.SelectCollection);
        this.setDescription();

        this.checkboxesWrapper.classList.add(styles.checkboxesWrapper);

        this.initCheckboxes();

        this.content.append(
            this.description,
            this.checkboxesWrapper
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
        })

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
}