import { injectable } from "tsyringe";
import * as styles from './word-variant.component.css';
import { BaseComponent } from "../../base-component/base-component";
import { Informer } from "../../../services/informer/informer.service";

@injectable()
export class WordVariantButton extends BaseComponent {
    public onVariantClick = new Informer<MouseEvent>();

    constructor() {
        super(styles);

        this.rootElement.addEventListener('mousedown', (e) => this.onVariantClick.inform(e));
    }
}