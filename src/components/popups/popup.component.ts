import { IconService } from "../../services/icon/icon.component";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './popup.component.css';

export abstract class PopupComponent extends BaseComponent {
    protected backdrop = document.createElement('div');
    protected wrapper = document.createElement('div');
    protected headerWrapper = document.createElement('div');
    protected title = document.createElement('h1');;
    protected closeButton = document.createElement('div');
    constructor(
        protected iconService: IconService
    ) {
        super(styles);

        this.backdrop.classList.add(styles.backdrop);
        this.wrapper.classList.add(styles.wrapper);
        this.headerWrapper.classList.add(styles.headerWrapper);
        this.title.classList.add(styles.title);
        this.closeButton.classList.add(styles.closeButton);


        this.closeButton.append(
            this.iconService.init('close')
        );

        this.closeButton.addEventListener('mouseup', () => this.hide())

        this.headerWrapper.append(
            this.title,
            this.closeButton
        );



        this.wrapper.append(this.headerWrapper);
        this.backdrop.append(this.wrapper);
        this.rootElement.append(this.backdrop);
    }

    protected setTitle(title: string) {
        this.title.textContent = title;
    }

    protected setContent(content: HTMLElement) {
        this.wrapper.append(content);
    }

    protected show() {
        this.rootElement.classList.remove(styles.hidden);
    }

    protected hide() {
        this.rootElement.classList.add(styles.hidden);
    }
}