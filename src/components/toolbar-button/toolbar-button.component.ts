import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './toolbar-button.component.css';

@injectable()
export class ToolbarButtonComponent extends BaseComponent {
    private iconWrapper = document.createElement('div');

    constructor() {
        super();

        this.applyRootStyle(styles);

        this.rootElement.append(
            this.iconWrapper
        );
    }

    public addTooltip(tooltip: string) {
        this.iconWrapper.title = tooltip;
    }

    public addIcon(icon: HTMLElement) {
        this.iconWrapper.append(icon);
    }
}