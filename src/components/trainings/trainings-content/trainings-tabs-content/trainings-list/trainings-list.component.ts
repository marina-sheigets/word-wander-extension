import { singleton } from 'tsyringe';
import { BaseComponent } from '../../../../base-component/base-component';
import * as styles from './trainings-list.component.css';
import { GameCardComponent } from '../../../../game-card/game-card.component';
import { I18nService } from '../../../../../services/i18n/i18n.service';
import { trainings } from '../../../../../constants/trainings';
import { TrainingsService } from '../../../../../services/trainings/trainings.service';
import { MessengerService } from '../../../../../services/messenger/messenger.service';
import { AmountWordsChipComponent } from '../../../../amount-words-chip/amount-words-chip.component';
import { Messages } from '../../../../../constants/messages';

@singleton()
export class TrainingsListComponent extends BaseComponent {
    constructor(
        protected trainingsService: TrainingsService,
        protected gameCardComponent: GameCardComponent,
        protected i18n: I18nService,
        protected messenger: MessengerService,
    ) {
        super(styles);

        this.messenger.subscribe(Messages.InitTrainingsList, this.initGameCards.bind(this));

    }

    private initGameCards() {
        this.rootElement.textContent = '';

        trainings.forEach((training) => {
            const card = new GameCardComponent(this.i18n, this.trainingsService, this.messenger);
            card.setGameID(training.id);
            card.setTitle(training.title);
            card.setDescription(training.description);

            const amount = this.trainingsService.getAmountOfWordsForTraining(training.name);
            const amountWordsChip = new AmountWordsChipComponent(this.i18n);
            amountWordsChip.setAmount(amount);

            card.setAmountWordsChip(amountWordsChip.rootElement);
            this.rootElement.appendChild(card.rootElement);
        });
    }
}