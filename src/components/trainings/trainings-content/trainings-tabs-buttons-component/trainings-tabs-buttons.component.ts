import { singleton } from "tsyringe";
import { i18nKeys } from "../../../../services/i18n/i18n-keys";
import { I18nService } from "../../../../services/i18n/i18n.service";
import { BaseComponent } from "../../../base-component/base-component";
import { ButtonComponent } from "../../../button/button.component";
import { TrainingsDictionaryComponent } from "../trainings-tabs-content/trainings-dictionary/trainings-dictionary.component";
import { TrainingsListComponent } from "../trainings-tabs-content/trainings-list/trainings-list.component";
import { TrainingsStatisticsComponent } from "../trainings-tabs-content/trainings-statistics/trainings-statistics.component";
import * as styles from './trainings-tabs-buttons.component.css';
import { TrainingsTabsService } from "../../../../services/trainings-tabs/trainings-tabs.service";
import { TrainingsTab } from "../../../../types/TrainingsTabs";

@singleton()
export class TrainingsTabsButtonsComponent extends BaseComponent {
    private buttonsContainer = document.createElement('div');

    constructor(
        protected i18n: I18nService,
        protected trainingsListComponent: TrainingsListComponent,
        protected trainingsDictionaryComponent: TrainingsDictionaryComponent,
        protected trainingsStatistics: TrainingsStatisticsComponent,
        protected trainingsTabsService: TrainingsTabsService
    ) {
        super(styles);

        this.initTabsButtons();

        this.buttonsContainer.classList.add(styles.buttonsContainer);

        this.rootElement.append(
            this.buttonsContainer,
        )
    }

    private initTabsButtons() {
        Object.values(TrainingsTab).forEach((button: keyof typeof i18nKeys) => {
            const buttonComponent = new ButtonComponent(this.i18n);

            buttonComponent.addButtonName(button as i18nKeys);
            buttonComponent.addButtonValue(button);

            if (button === i18nKeys.Trainings) {
                buttonComponent.rootElement.classList.add(styles.active);
            }

            buttonComponent.onClick.subscribe((e: MouseEvent) => {
                this.trainingsTabsService.changeTab((e.currentTarget as HTMLButtonElement).value as TrainingsTab);
                this.setAllUnactive();
                buttonComponent.rootElement.classList.add(styles.active);
            });

            this.buttonsContainer.append(buttonComponent.rootElement);
        });
    }

    private setAllUnactive() {
        const buttons = this.buttonsContainer.childNodes;

        buttons.forEach((button: HTMLElement) => {
            if (button.classList.contains(styles.active)) {
                button.classList.remove(styles.active);
            }
        })
    }

}