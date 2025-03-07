import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './checkbox.component.css';
import { Informer } from "../../services/informer/informer.service";

@injectable()
export class CheckboxComponent extends BaseComponent {
    private checkbox = document.createElement('input');
    public onCheckboxChange = new Informer();

    constructor() {
        super(styles);

        this.checkbox.type = 'checkbox';


        this.checkbox.addEventListener('change', this.informListeners.bind(this));

        this.rootElement.append(this.checkbox);
    }

    setName(name: string) {
        this.checkbox.name = name;
    }

    private informListeners(e: Event) {
        this.onCheckboxChange.inform(e.currentTarget)
    }

    public setChecked(checked: boolean) {
        this.checkbox.checked = checked;
    }
}