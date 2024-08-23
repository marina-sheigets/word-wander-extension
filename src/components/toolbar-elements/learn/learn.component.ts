import { singleton } from "tsyringe";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { IconName } from "../../../types/IconName";
import { BaseComponent } from "../../base-component/base-component";
import { ToolbarButtonComponent } from "../../toolbar-button/toolbar-button.component";
import * as styles from './learn.component.css';

@singleton()
export class LearnComponent extends BaseComponent {
    constructor(
        protected button: ToolbarButtonComponent,
    ) {
        super(styles);

        this.button.addIcon(IconName.Learn);
        this.button.addTooltip(i18nKeys.GoToTrainings);

        this.rootElement.append(button.rootElement);

        this.button.onPress.subscribe(this.goToTrainingsPage.bind(this));

    }

    private goToTrainingsPage() {
        // navigate to trainings page
    }
} 