import { singleton } from "tsyringe";
import { i18nKeys } from "../../services/i18n/i18n-keys";
import { I18nService } from "../../services/i18n/i18n.service";
import { BaseComponent } from "../base-component/base-component";
import { ButtonComponent } from "../button/button.component";
import * as styles from './random-word-container.component.css';
import { IconName } from "../../types/IconName";
import { Informer } from "../../services/informer/informer.service";

@singleton()
export class RandomWordContainerComponent extends BaseComponent {
    private buttonWrapper = document.createElement('div');
    private label = document.createElement('p');
    public onRandomizeWord = new Informer<void>();

    constructor(
        protected randomizeWordButton: ButtonComponent,
        protected i18n: I18nService
    ) {
        super();
        this.applyRootStyle(styles);

        this.i18n.follow(i18nKeys.GenerateRandomWord, (value) => {
            this.label.textContent = value;
        });

        this.randomizeWordButton.addButtonIcon(IconName.Random)
        this.buttonWrapper.append(
            this.randomizeWordButton.rootElement,
            this.label
        );

        this.rootElement.append(
            this.buttonWrapper
        );

        this.randomizeWordButton.onClick.subscribe(this.onRandomizeWord.inform.bind(this.onRandomizeWord));
    }

}