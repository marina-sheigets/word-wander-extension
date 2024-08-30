import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './checkbox.component.css';
import { Informer } from "../../services/informer/informer.service";

@injectable()
export class CheckboxComponent extends BaseComponent {
    private checkbox = document.createElement('input');
    public onCheckboxChange = new Informer();

    constructor(id: string) {
        super(styles);

        this.checkbox.type = 'checkbox';
        this.checkbox.name = id;

        this.checkbox.addEventListener('change', this.informListeners.bind(this));

        this.rootElement.append(this.checkbox);
    }

    private informListeners(e: Event) {
        this.onCheckboxChange.inform(e.currentTarget)
    }
}