import { singleton } from "tsyringe";
import { BaseComponent } from "../../../base-component/base-component";
import { SwitchComponent } from "../../../switch/switch.component";
import * as styles from './translation.component.css';

@singleton()
export class TranslationComponent extends BaseComponent {
    private title = document.createElement('h2');
    private switchWrapper = document.createElement('div');
    constructor(
        protected doubleClickSwitch: SwitchComponent,
        protected synonymsSwitch: SwitchComponent,
        protected usageSwitch: SwitchComponent
    ) {
        super(styles);

        this.title.textContent = 'Translation';

        this.doubleClickSwitch.setLabel('Translate with double click');
        this.synonymsSwitch.setLabel('Show synonyms');
        this.usageSwitch.setLabel('Show examples of usage');

        this.switchWrapper.classList.add(styles.switchWrapper);

        this.switchWrapper.append(
            this.doubleClickSwitch.rootElement,
            this.synonymsSwitch.rootElement,
            this.usageSwitch.rootElement
        );

        this.rootElement.append(
            this.title,
            this.switchWrapper
        );
    }

    setTitle(title: string) {
        this.title.textContent = title;
    }
}