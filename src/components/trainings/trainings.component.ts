import { singleton } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from "./trainings.component.css";
import { TrainingsContentComponent } from "./trainings-content/trainings-content.component";

@singleton()
export class TrainingsComponent extends BaseComponent {
    constructor(
        protected trainingsContent: TrainingsContentComponent
    ) {
        super(styles);

        this.rootElement.append(
            this.trainingsContent.rootElement
        );
    }
}