import { singleton } from "tsyringe";
import { i18nKeys } from "../../../../services/i18n/i18n-keys";
import { I18nService } from "../../../../services/i18n/i18n.service";
import { TrainingsTabsButton } from "../../../../types/TabsButton";
import { BaseComponent } from "../../../base-component/base-component";
import { ButtonComponent } from "../../../button/button.component";
import { TrainingsDictionaryComponent } from "../trainings-tabs-content/trainings-dictionary/trainings-dictionary.component";
import { TrainingsListComponent } from "../trainings-tabs-content/trainings-list/trainings-list.component";
import { TrainingsStatisticsComponent } from "../trainings-tabs-content/trainings-statistics/trainings-statistics.component";
import * as styles from './trainings-tabs-buttons.component.css';

@singleton()
export class TrainingsTabsButtonsComponent extends BaseComponent {
    private buttonsContainer = document.createElement('div');
    private tabContent = document.createElement('div');

    readonly tabsButtons: TrainingsTabsButton[] = [
        {
            label: i18nKeys.Trainings,
            component: this.trainingsListComponent.rootElement
        },
        {
            label: i18nKeys.Dictionary,
            component: this.trainingsDictionaryComponent.rootElement
        },
        {
            label: i18nKeys.Statistics,
            component: this.trainingsStatistics.rootElement
        }
    ];

    constructor(
        protected i18n: I18nService,
        protected trainingsListComponent: TrainingsListComponent,
        protected trainingsDictionaryComponent: TrainingsDictionaryComponent,
        protected trainingsStatistics: TrainingsStatisticsComponent
    ) {
        super(styles);

        this.initTabsButtons();

        this.rootElement.append(
            this.buttonsContainer,
            this.tabContent
        )
    }

    private initTabsButtons() {
        this.tabsButtons.forEach((button: TrainingsTabsButton) => {
            const buttonComponent = new ButtonComponent(this.i18n);

            buttonComponent.addButtonName(button.label);
            buttonComponent.addButtonValue(button.label);

            if (button.label === i18nKeys.Trainings) {
                buttonComponent.rootElement.classList.add(styles.active);
            }

            buttonComponent.onClick.subscribe((e: MouseEvent) => {
                this.setTabContent(e);
                this.setAllUnactive();
                buttonComponent.rootElement.classList.add(styles.active);
            })

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

    private clearTabContent() {
        this.tabContent.innerHTML = '';
    }

    protected setTabContent(e: MouseEvent) {
        const target = e.currentTarget as HTMLInputElement;
        const selectedComponent = this.tabsButtons.find((button: TrainingsTabsButton) => button.label === target.value)?.component;

        this.clearTabContent();
        if (selectedComponent) {
            this.tabContent.append(selectedComponent);
        }
    }
}