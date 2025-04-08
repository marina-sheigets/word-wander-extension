import { singleton } from "tsyringe";
import { TrainingsTabsService } from "../../../../services/trainings-tabs/trainings-tabs.service";
import { TrainingsTabsButton } from "../../../../types/TabsButton";
import { TrainingsTab } from "../../../../types/TrainingsTabs";
import { BaseComponent } from "../../../base-component/base-component";
import { TrainingsDictionaryComponent } from "./trainings-dictionary/trainings-dictionary.component";
import { TrainingsListComponent } from "./trainings-list/trainings-list.component";
import * as styles from "./trainings-tabs-content.component.css";
import { I18nService } from "../../../../services/i18n/i18n.service";
import { UnauthorizedOverlayComponent } from "../../../unauthorized-overlay/unauthorized-overlay.component";
import { MessengerService } from "../../../../services/messenger/messenger.service";
import { Messages } from "../../../../constants/messages";
import { SettingsNames } from "../../../../constants/settingsNames";
import { SettingsService } from "../../../../services/settings/settings.service";
import { AuthorizationData } from "../../../../types/AuthorizationData";
import { StatisticsTabComponent } from "./trainings-statistics/statistics-tab.component";

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
            component: this.statisticsTabComponent.rootElement
        }
    ];

    constructor(
        protected trainingsDictionaryComponent: TrainingsDictionaryComponent,
        protected trainingsListComponent: TrainingsListComponent,
        protected statisticsTabComponent: StatisticsTabComponent,
        protected unauthorizedOverlay: UnauthorizedOverlayComponent,
        protected trainingsTabsService: TrainingsTabsService,
        protected i18n: I18nService,
        protected messenger: MessengerService,
        protected settingsService: SettingsService
    ) {
        super(styles);

        this.setTabContent(this.trainingsTabsService.getCurrentTab());

        this.title.classList.add(styles.title);
        this.tabContent.classList.add(styles.tabContent);

        this.trainingsTabsService.onTabChange.subscribe(this.setTabContent.bind(this));

        this.rootElement.append(
            this.title,
            this.tabContent,
            this.unauthorizedOverlay.rootElement
        );

        this.settingsService.follow(SettingsNames.User, this.toggleTabVisibility.bind(this));
    }

    clearTabContent() {
        this.tabContent.innerHTML = '';
    }

    protected setTabContent(tabName: TrainingsTab) {
        this.messenger.send(Messages.ChangeExtensionPageTitle, tabName);
        this.unauthorizedOverlay.setDescription(tabName);
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

    private toggleTabVisibility(userData: AuthorizationData) {
        if (userData) {
            this.tabContent.classList.remove(styles.hidden);
            this.unauthorizedOverlay.hide();
        } else {
            this.tabContent.classList.add(styles.hidden);
            this.unauthorizedOverlay.show();
        }
    }
}
