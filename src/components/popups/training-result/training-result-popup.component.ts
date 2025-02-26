import { singleton } from 'tsyringe';
import { Messages } from '../../../constants/messages';
import { i18nKeys } from '../../../services/i18n/i18n-keys';
import { I18nService } from '../../../services/i18n/i18n.service';
import { MessengerService } from '../../../services/messenger/messenger.service';
import { TrainingsStatisticsService } from '../../../services/trainings-statistics/trainings-statistics.service';
import { HistoryItem } from '../../../types/History';
import { IconName } from '../../../types/IconName';
import { ListType } from '../../../types/ResultListType';
import { IconComponent } from '../../icon/icon.component';
import { PopupComponent } from '../popup.component';
import * as styles from './training-result-popup.component.css';
import { ComponentsFactory } from '../../factories/component.factory.';

@singleton()
export class TrainingResultPopup extends PopupComponent {
    private content: HTMLElement = document.createElement('div');

    constructor(
        protected i18n: I18nService,
        protected trainingsStatisticsService: TrainingsStatisticsService,
        protected messenger: MessengerService,
        protected componentsFactory: ComponentsFactory
    ) {
        super(i18n);
        this.addClassNamesToComponents(styles);

        this.setTitle(i18nKeys.TrainingResultTitle)

        this.setContent(this.content);

        this.messenger.subscribe(Messages.ShowTrainingStatistics, () => {
            this.show();
            this.clear();
            this.renderCorrectWords();
            this.renderIncorrectWords();
        });

        this.hide();
    }

    private renderCorrectWords() {
        this.renderList(this.trainingsStatisticsService.getRightWords(), ListType.Correct)
    }

    private renderIncorrectWords() {
        this.renderList(this.trainingsStatisticsService.getWrongWords(), ListType.Incorrect)
    }

    private renderList(words: HistoryItem[], listType: ListType) {
        if (words.length === 0) {
            return;
        }

        const listWrapper = document.createElement('div');
        listWrapper.classList.add(styles.listWrapper);

        const listIcon = this.componentsFactory.createComponent(IconComponent);
        listIcon.setIcon(listType === ListType.Correct ? IconName.Tick : IconName.Close);

        const list = document.createElement('div');
        list.classList.add(styles.list);

        const listTitle = document.createElement('h3');

        const i18nKey = listType === ListType.Correct ? i18nKeys.CorrectWords : i18nKeys.IncorrectWords;
        this.i18n.follow(i18nKey, (value) => {
            listTitle.textContent = value;
        });

        const listItems = document.createElement('ul');

        words.forEach((item) => {
            const translation = document.createElement('span');
            translation.textContent = item.translation;
            translation.classList.add(styles.translation);

            const word = document.createElement('span');
            word.textContent = item.word;
            word.classList.add(listType === ListType.Correct ? styles.correctWord : styles.incorrectWord);

            const divider = document.createElement('hr');
            const listItem = document.createElement('li');

            listItem.append(word, translation);
            listItems.appendChild(listItem);
            listItems.appendChild(divider);
        });

        list.append(listTitle, listItems);

        listWrapper.append(listIcon.rootElement, list);

        this.content.appendChild(listWrapper);
    }

    private clear() {
        this.content.textContent = '';
    }

    public hide() {
        super.hide();
        this.trainingsStatisticsService.clearStatistics();
    }
}