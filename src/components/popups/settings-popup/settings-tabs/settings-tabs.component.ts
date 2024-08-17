import { singleton } from "tsyringe";
import { i18nKeys } from "../../../../services/i18n/i18n-keys";
import { I18nService } from "../../../../services/i18n/i18n.service";
import { IconService } from "../../../../services/icon/icon.component";
import { TabsButton } from "../../../../types/TabsButton";
import { BaseComponent } from "../../../base-component/base-component";
import { ButtonComponent } from "../../../button/button.component";
import { LanguagesComponent } from "../languages/languages.component";
import { ProfileSettingsComponent } from "../profile-settings/profile-settings.component";
import { PronunciationComponent } from "../pronunciation/pronunciation.component";
import { TranslationComponent } from "../translation/translation.component";
import * as styles from './settings-tabs.component.css';

@singleton()
export class SettingsTabsComponent extends BaseComponent {
    private buttonsContainer = document.createElement('div');
    private tabContent = document.createElement('div');

    readonly tabsButtons: TabsButton[] = [
        {
            label: i18nKeys.Profile,
            component: this.profileSettingsComponent.rootElement
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
        protected languagesComponent: LanguagesComponent,
        protected translationComponent: TranslationComponent,
        protected pronunciationComponent: PronunciationComponent,
        protected iconService: IconService,
        protected i18n: I18nService
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
        this.tabsButtons.forEach((button: TabsButton) => {
            const buttonComponent = new ButtonComponent(this.iconService, this.i18n);

            buttonComponent.addButtonValue(button.label);
            buttonComponent.addButtonName(button.label as i18nKeys);
            buttonComponent.onClick.subscribe((e: MouseEvent) => {
                this.setTabContent(e);
                buttonComponent.rootElement.classList.add(styles.active);
            })
            this.buttonsContainer.append(buttonComponent.rootElement);
        });
    }

    protected setTabContent(e: MouseEvent) {
        const target = e.target as HTMLInputElement;
        const selectedComponent = this.tabsButtons.find((button: TabsButton) => button.label === target.value)?.component;

        this.clearTabContent();
        if (selectedComponent) {
            this.tabContent.append(selectedComponent);
        }
    }

    private clearTabContent() {
        this.tabContent.innerHTML = '';
    }
}