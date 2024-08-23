import { singleton } from "tsyringe";
import { BaseComponent } from "../../../../base-component/base-component";
import * as styles from "./trainings-dictionary.component.css";

@singleton()
export class TrainingsDictionaryComponent extends BaseComponent {
    constructor() {
        super(styles);
    }
}