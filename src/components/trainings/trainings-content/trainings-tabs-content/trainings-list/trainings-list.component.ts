import { singleton } from 'tsyringe';
import { BaseComponent } from '../../../../base-component/base-component';
import * as styles from './trainings-list.component.css';
import { GameCardComponent } from '../../../../game-card/game-card.component';
import { trainings } from '../../../../../constants/trainings';
import { TrainingsService } from '../../../../../services/trainings/trainings.service';
import { MessengerService } from '../../../../../services/messenger/messenger.service';
import { AmountWordsChipComponent } from '../../../../amount-words-chip/amount-words-chip.component';
import { Messages } from '../../../../../constants/messages';
import { ComponentsFactory } from '../../../../factories/component.factory.';

@singleton()
export class TrainingsListComponent extends BaseComponent {
    constructor(
        protected trainingsService: TrainingsService,
        protected gameCardComponent: GameCardComponent,
        protected messenger: MessengerService,
        protected componentsFactory: ComponentsFactory,
    ) {
        super(styles);

        this.messenger.subscribe(Messages.InitTrainingsList, this.initGameCards.bind(this));

    }

    private initGameCards() {
        this.rootElement.textContent = '';

        trainings.forEach((training) => {
            const card = this.componentsFactory.createComponent(GameCardComponent);

            card.setGameID(training.id);
            card.setTitle(training.title);
            card.setDescription(training.description);

            const amount = this.trainingsService.getAmountOfWordsForTraining(training.name);
            const amountWordsChip = this.componentsFactory.createComponent(AmountWordsChipComponent);
            amountWordsChip.setAmount(amount);

            card.setAmountWordsChip(amountWordsChip.rootElement);
            this.rootElement.appendChild(card.rootElement);
        });
    }
}