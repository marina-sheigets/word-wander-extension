import { injectable } from 'tsyringe';
import { BaseComponent } from '../base-component/base-component';
import * as styles from './game-card.component.css';
import { i18nKeys } from '../../services/i18n/i18n-keys';
import { I18nService } from '../../services/i18n/i18n.service';
import { IconComponent } from '../icon/icon.component';
import { IconName } from '../../types/IconName';
import { TrainingsService } from '../../services/trainings/trainings.service';
import { MessengerService } from '../../services/messenger/messenger.service';
import { Messages } from '../../constants/messages';
import { ComponentsFactory } from '../factories/component.factory.';

@injectable()
export class GameCardComponent extends BaseComponent {
    private gameID: null | number = null;
    private title = document.createElement('h2');
    private description = document.createElement('p');
    private amountOfWords = document.createElement('p');

    constructor(
        protected i18n: I18nService,
        protected trainingsService: TrainingsService,
        protected messenger: MessengerService,
        protected componentsFactory: ComponentsFactory
    ) {
        super(styles);

        const handIcon = this.componentsFactory.createComponent(IconComponent);
        handIcon.setIcon(IconName.Muscle);

        this.rootElement.append(
            this.title,
            this.description,
            this.amountOfWords,
            handIcon.rootElement
        );

        this.rootElement.addEventListener('mousedown', this.handleClick.bind(this));
    }

    setGameID(id: number) {
        this.gameID = id;
    }

    setTitle(key: i18nKeys) {
        this.i18n.follow(key, (value) => {
            this.title.textContent = value;
        })
    }

    setDescription(key: i18nKeys) {
        this.i18n.follow(key, (value) => {
            this.description.textContent = value;
        })
    }

    setAmountWordsChip(amountWordsChip: HTMLElement) {
        this.amountOfWords.appendChild(amountWordsChip);
    }

    private handleClick(e: MouseEvent) {
        e.stopPropagation();

        if (!this.trainingsService.areEnoughWordsForTraining(this.gameID || 0)) {
            this.messenger.send(Messages.ShowNotEnoughWordsPopup);
            return;
        }

        if (this.gameID) {
            this.messenger.send(Messages.ShowStartTrainingPopup, this.gameID);
        }
    }
}