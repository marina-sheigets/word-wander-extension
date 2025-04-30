import { injectable } from "tsyringe";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { BaseComponent } from "../../base-component/base-component";
import { CheckboxComponent } from "../../checkbox/checkbox.component";
import { InputComponent } from "../input.component";
import * as styles from './add-new-collection-input.component.css';

@injectable()
export class AddNewCollectionInputComponent extends BaseComponent {

    constructor(
        protected i18n: I18nService,
        protected addNewCollectionInput: InputComponent,
        protected checkbox: CheckboxComponent
    ) {
        super(styles);

        this.addNewCollectionInput.setInputSettings('text', i18nKeys.EnterNewCollectionName);
        this.addNewCollectionInput.onChange.subscribe(this.handleInputChange.bind(this));

        this.checkbox.setDisabled();

        this.rootElement.append(
            this.checkbox.rootElement,
            this.addNewCollectionInput.rootElement
        );

    }

    private handleInputChange(value: string) {
        if (!value || value.trim().length === 0) {
            this.checkbox.setChecked(false);
            return;
        }

        this.checkbox.setChecked(true);
    }
}