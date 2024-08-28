import { singleton } from "tsyringe";
import { BaseComponent } from "../../../../base-component/base-component";
import * as styles from "./trainings-dictionary.component.css";
import { FindWordInputComponent } from "../../../../input/find-word-input/find-word-input.component";

@singleton()
export class TrainingsDictionaryComponent extends BaseComponent {
    constructor(
        protected findWordInputComponent: FindWordInputComponent,
    ) {
        super(styles);

        this.rootElement.append(
            this.findWordInputComponent.rootElement
        );
    }
}