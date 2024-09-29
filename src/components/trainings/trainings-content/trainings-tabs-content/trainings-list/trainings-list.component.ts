import { singleton } from 'tsyringe';
import { BaseComponent } from '../../../../base-component/base-component';
import * as styles from './trainings-list.component.css';
import { GameCardComponent } from '../../../../game-card/game-card.component';
import { I18nService } from '../../../../../services/i18n/i18n.service';
import { trainings } from '../../../../../constants/trainings';
import { TrainingsService } from '../../../../../services/trainings/trainings.service';

@singleton()
export class TrainingsListComponent extends BaseComponent {

    constructor(
        protected trainingsService: TrainingsService,
        protected gameCardComponent: GameCardComponent,
        protected i18n: I18nService,
    ) {
        super(styles);

        this.initGameCards();
    }

    private initGameCards() {
        trainings.forEach((training) => {
            const card = new GameCardComponent(this.i18n, this.trainingsService);
            card.setGameID(training.id);
            card.setTitle(training.title);
            card.setDescription(training.description);

            this.rootElement.appendChild(card.rootElement);
        });
    }
}