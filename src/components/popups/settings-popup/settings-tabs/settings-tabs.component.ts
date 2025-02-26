import { singleton } from "tsyringe";
import { i18nKeys } from "../../../../services/i18n/i18n-keys";
import { SettingsTabsButton } from "../../../../types/TabsButton";
import { BaseComponent } from "../../../base-component/base-component";
import { ButtonComponent } from "../../../button/button.component";
import { LanguagesComponent } from "../languages/languages.component";
import { ProfileSettingsComponent } from "../profile-settings/profile-settings.component";
import { PronunciationComponent } from "../pronunciation/pronunciation.component";
import { TranslationComponent } from "../translation/translation.component";
import * as styles from './settings-tabs.component.css';
import { PreferencesComponent } from "../preferences/preferences.component";
import { ComponentsFactory } from "../../../factories/component.factory.";

@singleton()
export class SettingsTabsComponent extends BaseComponent {
    private buttonsContainer = document.createElement('div');
    private tabContent = document.createElement('div');

    readonly tabsButtons: SettingsTabsButton[] = [
        {
            label: i18nKeys.Profile,
            component: this.profileSettingsComponent.rootElement
        },
        {
            label: i18nKeys.Preferences,
            component: this.preferencesComponent.rootElement
        },
        {
            label: i18nKeys.Languages,
            component: this.languagesComponent.rootElement
        },
        {
            label: i18nKeys.Translation,
            component: this.translationComponent.rootElement
        },
        {
            label: i18nKeys.Pronunciation,
            component: this.pronunciationComponent.rootElement
        }
    ];

    constructor(
        protected profileSettingsComponent: ProfileSettingsComponent,
        protected preferencesComponent: PreferencesComponent,
        protected languagesComponent: LanguagesComponent,
        protected translationComponent: TranslationComponent,
        protected pronunciationComponent: PronunciationComponent,
        protected componentsFactory: ComponentsFactory
    ) {
        super();
        this.applyRootStyle(styles);

        this.buttonsContainer.classList.add(styles.buttonsContainer);
        this.tabContent.classList.add(styles.tabContent);

        this.tabContent.append(this.profileSettingsComponent.rootElement);
        this.initTabsButtons();
        this.rootElement.append(
            this.buttonsContainer,
            this.tabContent
        )
    }

    private initTabsButtons() {
        this.tabsButtons.forEach((button: SettingsTabsButton) => {
            const buttonComponent = this.componentsFactory.createComponent(ButtonComponent);

            buttonComponent.addButtonValue(button.label);
            buttonComponent.addButtonName(button.label);

            if (button.label === i18nKeys.Profile) {
                buttonComponent.rootElement.classList.add(styles.active);
            }

            buttonComponent.onClick.subscribe(() => {
                this.setTabContent(button.component);
                this.setAllUnactive();
                buttonComponent.rootElement.classList.add(styles.active);
            })
            this.buttonsContainer.append(buttonComponent.rootElement);
        });
    }

    protected setTabContent(selectedComponent: HTMLElement) {
        this.clearTabContent();
        if (selectedComponent) {
            this.tabContent.append(selectedComponent);
        }
    }

    private clearTabContent() {
        this.tabContent.innerHTML = '';
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