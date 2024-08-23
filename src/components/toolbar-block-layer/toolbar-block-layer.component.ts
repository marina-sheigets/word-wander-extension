import { singleton } from 'tsyringe';
import { i18nKeys } from '../../services/i18n/i18n-keys';
import { I18nService } from '../../services/i18n/i18n.service';
import { TOOLBAR_MODE, ToolbarService } from '../../services/toolbar/toolbar.service';
import { BaseComponent } from '../base-component/base-component';
import { ButtonComponent } from '../button/button.component';
import * as styles from './toolbar-block-layer.component.css';

@singleton()
export class ToolbarBlockLayerComponent extends BaseComponent {
    label = document.createElement('div');
    constructor(
        protected toolbarService: ToolbarService,
        protected i18n: I18nService,
        protected learnWordsButton: ButtonComponent
    ) {
        super(styles);

        window.addEventListener('offline', this.show.bind(this));
        window.addEventListener('online', this.hide.bind(this));

        this.i18n.follow(i18nKeys.YouAreOffline, (value) => {
            this.label.innerText = value;
        });

        this.learnWordsButton.addButtonName(i18nKeys.GoToTrainings)

        this.hide();

        this.rootElement.append(
            this.label,
            this.learnWordsButton.rootElement
        );
        this.rootElement.addEventListener('dblclick', this.toolbarService.setToolbarMode.bind(this.toolbarService, TOOLBAR_MODE.MINIMIZED));
    }

    public show() {
        this.rootElement.classList.remove(styles.hidden);
    }

    public hide() {
        this.rootElement.classList.add(styles.hidden);
    }

}