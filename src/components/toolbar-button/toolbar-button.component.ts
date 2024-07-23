import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './toolbar-button.component.css';
import { IconService } from "../../services/icon/icon.component";

@injectable()
export class ToolbarButtonComponent extends BaseComponent {
    private iconWrapper = document.createElement('div');

    constructor(
        protected iconService: IconService
    ) {
        super();

        this.applyRootStyle(styles);
        this.rootElement.append(
            this.iconWrapper
        );
    }

    public addTooltip(tooltip: string) {
        this.iconWrapper.title = tooltip;
    }

    public addIcon(name: string) {
        this.iconWrapper.classList.add(styles.iconWrapper);
        this.iconWrapper.append(this.iconService.init(name));
    }
}