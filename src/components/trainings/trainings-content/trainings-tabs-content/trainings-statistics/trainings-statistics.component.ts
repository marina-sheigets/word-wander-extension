import { singleton } from "tsyringe";
import { BaseComponent } from "../../../../base-component/base-component";
import * as styles from "./trainings-statistics.component.css";

@singleton()
export class TrainingsStatisticsComponent extends BaseComponent {
    constructor() {
        super(styles);
    }
}