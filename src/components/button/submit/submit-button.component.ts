import { injectable } from "tsyringe";
import { IconService } from "../../../services/icon/icon.component";
import { ButtonComponent } from "../button.component";
import * as styles from './submit-button.component.css';

@injectable()
export class SubmitButton extends ButtonComponent {
    constructor(
        protected iconService: IconService,
    ) {
        super(iconService);
        this.applyRootStyle(styles);
    }
}