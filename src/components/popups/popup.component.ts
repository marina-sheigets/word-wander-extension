import { i18nKeys } from "../../services/i18n/i18n-keys";
import { I18nService } from "../../services/i18n/i18n.service";
import { Informer } from "../../services/informer/informer.service";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './popup.component.css';

export abstract class PopupComponent extends BaseComponent {
    protected backdrop = document.createElement('div');
    protected wrapper = document.createElement('div');
    protected headerWrapper = document.createElement('div');
    protected title = document.createElement('h1');;
    protected closeButton = document.createElement('div');
    protected onClose = new Informer();

    constructor(
        protected i18n: I18nService
    ) {
        super(styles);

        this.backdrop.classList.add(styles.backdrop);
        this.wrapper.classList.add(styles.wrapper);
        this.headerWrapper.classList.add(styles.headerWrapper);
        this.title.classList.add(styles.title);
        this.closeButton.classList.add(styles.closeButton);

        this.closeButton.innerHTML = `&#x2715;`;

        this.closeButton.onclick = () => {
            this.hide()
        }

        this.headerWrapper.append(
            this.title,
            this.closeButton
        );

        this.wrapper.append(this.headerWrapper);
        this.backdrop.append(this.wrapper);
        this.rootElement.append(this.backdrop);

        this.backdrop.addEventListener('mousedown', (e) => {
            if (e.target === this.backdrop) {
                this.hide();
            }
        });
    }

    protected setTitle(title: i18nKeys) {
        this.i18n.follow(title, (value: string) => {
            this.title.textContent = value;
        });
    }

    protected setContent(content: HTMLElement) {
        this.wrapper.append(content);
    }

    public show() {
        this.rootElement.classList.remove(styles.hidden);
    }

    public hide() {
        this.onClose.inform();
        this.rootElement.classList.add(styles.hidden);
    }

    setWidth(width: string) {
        this.wrapper.style.width = width;
    }
}