import { singleton } from 'tsyringe';
import { BaseComponent } from '../../base-component/base-component';
import * as styles from './trainings-content.component.css';
import { TrainingsTabsButtonsComponent } from './trainings-tabs-buttons-component/trainings-tabs-buttons.component';

@singleton()
export class TrainingsContentComponent extends BaseComponent {
    constructor(
        protected trainingsTabsButtonsComponent: TrainingsTabsButtonsComponent,
    ) {
        super(styles);

        this.rootElement.append(
            this.trainingsTabsButtonsComponent.rootElement
        );
    }
}