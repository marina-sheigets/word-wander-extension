import { singleton } from "tsyringe";
import { TrainingsTabsService } from "../../../../services/trainings-tabs/trainings-tabs.service";
import { TrainingsTabsButton } from "../../../../types/TabsButton";
import { TrainingsTab } from "../../../../types/TrainingsTabs";
import { BaseComponent } from "../../../base-component/base-component";
import { TrainingsDictionaryComponent } from "./trainings-dictionary/trainings-dictionary.component";
import { TrainingsListComponent } from "./trainings-list/trainings-list.component";
import { TrainingsStatisticsComponent } from "./trainings-statistics/trainings-statistics.component";
import * as styles from "./trainings-tabs-content.component.css";
import { I18nService } from "../../../../services/i18n/i18n.service";
import { i18nKeys } from "../../../../services/i18n/i18n-keys";

@singleton()
export class TrainingsTabsContentComponent extends BaseComponent {
    private title = document.createElement('h2');
    private tabContent = document.createElement('div');

    private tabsButtons: TrainingsTabsButton[] = [
        {
            label: TrainingsTab.Trainings,
            component: this.trainingsListComponent.rootElement
        },
        {
            label: TrainingsTab.Dictionary,
            component: this.trainingsDictionaryComponent.rootElement
        },
        {
            label: TrainingsTab.Statistics,
            component: this.trainingsStatistics.rootElement
        }
    ];

    constructor(
        protected trainingsDictionaryComponent: TrainingsDictionaryComponent,
        protected trainingsListComponent: TrainingsListComponent,
        protected trainingsStatistics: TrainingsStatisticsComponent,
        protected trainingsTabsService: TrainingsTabsService,
        protected i18n: I18nService
    ) {
        super(styles);

        this.setTabContent(this.trainingsTabsService.getCurrentTab());

        this.title.classList.add(styles.title);
        this.trainingsTabsService.onTabChange.subscribe(this.setTabContent.bind(this));

        this.rootElement.append(
            this.title,
            this.tabContent
        );
    }

    clearTabContent() {
        this.tabContent.innerHTML = '';
    }

    protected setTabContent(tabName: TrainingsTab) {
        this.clearTabContent();

        const selectedComponent = this.tabsButtons.find((button: TrainingsTabsButton) => button.label === tabName)?.component;

        if (selectedComponent) {
            this.tabContent.append(selectedComponent);
        }

        this.setTitle();
    }

    private setTitle() {
        const tabTitleKey = this.trainingsTabsService.getCurrentTab();

        this.i18n.follow(tabTitleKey as any, (title: string) => {
            this.title.textContent = title;
        });
    }
}
