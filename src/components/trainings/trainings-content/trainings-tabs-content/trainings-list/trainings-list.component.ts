import { singleton } from 'tsyringe';
import { BaseComponent } from '../../../../base-component/base-component';
import * as styles from './trainings-list.component.css';
import { GameCardComponent } from '../../../../game-card/game-card.component';
import { I18nService } from '../../../../../services/i18n/i18n.service';
import { i18nKeys } from '../../../../../services/i18n/i18n-keys';
import { trainings } from '../../../../../constants/trainings';

@singleton()
export class TrainingsListComponent extends BaseComponent {

    constructor(
        protected gameCardComponent: GameCardComponent,
        protected i18n: I18nService,
    ) {
        super(styles);

        this.initGameCards();
    }

    private initGameCards() {
        trainings.forEach((training) => {
            const card = new GameCardComponent(this.i18n);
            card.setGameID(training.id);
            card.setTitle(training.title);
            card.setDescription(training.description);

            card.onGameCardClick.subscribe(this.startGame.bind(this));

            this.rootElement.appendChild(card.rootElement);
        });
    }

    private startGame() {
        //const selectedGame = trainings.find((game) => game.id === selectedGameID);
    }
}