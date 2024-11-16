import { singleton } from "tsyringe";
import { i18nKeys } from "../../services/i18n/i18n-keys";
import { I18nService } from "../../services/i18n/i18n.service";
import { TrainingsTab } from "../../types/TrainingsTabs";
import { BaseComponent } from "../base-component/base-component";
import * as styles from "./unauthorized-overlay.component.css";
import { SignInButton } from "../button/sign-in/sign-in.button";

@singleton()
export class UnauthorizedOverlayComponent extends BaseComponent {
    private centralBlock = document.createElement('div');
    private title = document.createElement('h2');
    private description = document.createElement('p');
    private nameOfTab = document.createElement('span');
    private tabDescription = document.createElement('span');
    constructor(
        protected signInButton: SignInButton,
        protected i18n: I18nService
    ) {
        super(styles);

        this.i18n.follow(i18nKeys.UnauthorizedTitle, (value) => {
            this.title.textContent = value;
        });


        this.centralBlock.classList.add(styles.centralBlock);

        this.description.append(this.nameOfTab, this.tabDescription);

        this.centralBlock.append(
            this.title,
            this.description,
            this.signInButton.rootElement
        );

        this.rootElement.append(this.centralBlock);

        this.hide();
    }

    hide() {
        this.rootElement.classList.add(styles.hidden);
    }

    show() {
        this.rootElement.classList.remove(styles.hidden);
    }

    setDescription(currentTabTitle: string) {
        this.i18n.followMany(
            [i18nKeys.UnauthorizedDescriptionPlural, i18nKeys.UnauthorizedDescriptionSingular, currentTabTitle as any],
            ([descriptionPlural, tabDescriptionSingular, tabName = ""]) => {
                this.description.textContent = tabName + (currentTabTitle === TrainingsTab.Trainings ? descriptionPlural : tabDescriptionSingular);
            });
    }
}
