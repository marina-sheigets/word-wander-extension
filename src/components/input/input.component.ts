import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './input.component.css';
import { Informer } from "../../services/informer/informer.service";
import { IconService } from "../../services/icon/icon.component";

@injectable()
export class InputComponent extends BaseComponent {
    input = document.createElement('input');
    onChange = new Informer<string>();

    constructor(
        protected iconService: IconService
    ) {
        super();

        this.applyRootStyle(styles);

        this.input.addEventListener('keydown', this.onInputChange.bind(this));

        this.rootElement.append(
            this.input,
        );
    }

    private onInputChange(e: KeyboardEvent) {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        e.stopPropagation();

        this.onChange.inform(this.input.value);
    }

    setInputSettings(type: string, placeholder: string) {
        this.input.type = type;
        this.input.placeholder = placeholder;
    }

    setDisabled() {
        this.input.disabled = true;
    }

    setEnabled() {
        this.input.disabled = false;
    }

    clear() {
        this.input.value = "";
    }
}