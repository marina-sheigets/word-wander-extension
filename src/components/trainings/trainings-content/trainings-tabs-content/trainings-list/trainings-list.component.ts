import { singleton } from 'tsyringe';
import { BaseComponent } from '../../../../base-component/base-component';
import * as styles from './trainings-list.component.css';

@singleton()
export class TrainingsListComponent extends BaseComponent {
    constructor(
    ) {
        super(styles);
    }
}