import { singleton } from 'tsyringe';
import { BaseComponent } from '../../../../base-component/base-component';
import * as styles from './trainings-list.component.css';
import { TrainingCardComponent } from '../../../../training-card/training-card.component';
import { trainings } from '../../../../../constants/trainings';
import { TrainingsService } from '../../../../../services/trainings/trainings.service';
import { MessengerService } from '../../../../../services/messenger/messenger.service';
import { AmountWordsChipComponent } from '../../../../amount-words-chip/amount-words-chip.component';
import { Messages } from '../../../../../constants/messages';
import { ComponentsFactory } from '../../../../factories/component.factory.';
import { LoaderComponent } from '../../../../loader/loader.component';

@singleton()
export class TrainingsListComponent extends BaseComponent {
    constructor(
        protected trainingsService: TrainingsService,
        protected messenger: MessengerService,
        protected componentsFactory: ComponentsFactory,
        protected loader: LoaderComponent
    ) {
        super(styles);


        this.messenger.subscribe(Messages.InitTrainingsList, this.initGameCards.bind(this));

        this.loader.show();

        this.rootElement.append(
            this.loader.rootElement
        );
    }

    private initGameCards() {
        this.rootElement.textContent = '';

        trainings.forEach((training) => {
            const card = this.componentsFactory.createComponent(TrainingCardComponent);

            card.setGameID(training.id);
            card.setTitle(training.title);
            card.setDescription(training.description);

            const amount = this.trainingsService.getAmountOfWordsForTraining(training.name);
            const amountWordsChip = this.componentsFactory.createComponent(AmountWordsChipComponent);
            amountWordsChip.setAmount(amount);

            card.setAmountWordsChip(amountWordsChip.rootElement);
            card.toggleActiveState(amount >= training.minimumAmountOfWords);

            this.rootElement.appendChild(card.rootElement);
        });
    }
}