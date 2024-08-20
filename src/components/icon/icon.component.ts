import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './icon.component.css';

@injectable()
export class IconComponent extends BaseComponent {
    constructor() {
        super();

        this.applyRootStyle(styles);
    }

    setIcon(name: string) {
        const iconSvg = require(`../../../assets/icons/${name}.svg`);
        const icon = this.htmlToElement(iconSvg);
        this.rootElement.append(icon);
    }
}