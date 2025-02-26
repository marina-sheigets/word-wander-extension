import { singleton } from "tsyringe";
import { i18nKeys } from "../../../../services/i18n/i18n-keys";
import { BaseComponent } from "../../../base-component/base-component";
import { ButtonComponent } from "../../../button/button.component";
import * as styles from './trainings-tabs-buttons.component.css';
import { TrainingsTabsService } from "../../../../services/trainings-tabs/trainings-tabs.service";
import { TrainingsTab } from "../../../../types/TrainingsTabs";
import { ComponentsFactory } from "../../../factories/component.factory.";

@singleton()
export class TrainingsTabsButtonsComponent extends BaseComponent {
    private buttonsContainer = document.createElement('div');

    constructor(
        protected trainingsTabsService: TrainingsTabsService,
        protected componentsFactory: ComponentsFactory
    ) {
        super(styles);

        this.initTabsButtons();

        this.buttonsContainer.classList.add(styles.buttonsContainer);

        this.rootElement.append(
            this.buttonsContainer,
        )

        this.trainingsTabsService.onTabChange.subscribe(this.setActiveTab.bind(this));
    }

    private initTabsButtons() {
        Object.values(TrainingsTab).forEach((button: keyof typeof i18nKeys) => {
            const buttonComponent = this.componentsFactory.createComponent(ButtonComponent);

            buttonComponent.addButtonName(button as i18nKeys);
            buttonComponent.addButtonValue(button);

            if (button === i18nKeys.Trainings) {
                buttonComponent.rootElement.classList.add(styles.active);
            }

            buttonComponent.onClick.subscribe((e: MouseEvent) => {
                this.trainingsTabsService.changeTab((e.currentTarget as HTMLButtonElement).value as TrainingsTab);
            });

            this.buttonsContainer.append(buttonComponent.rootElement);
        });
    }

    private setAllInactive() {
        const buttons = this.buttonsContainer.childNodes;

        buttons.forEach((button: HTMLElement) => {
            button.classList.remove(styles.active);
        })
    }

    private setActiveTab(tab: TrainingsTab) {
        this.setAllInactive();
        this.buttonsContainer.querySelector(`[value=${tab}]`)?.parentElement?.classList.add(styles.active);

    }
}