import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './icon.component.css';
import { IconName } from "../../types/IconName";

@injectable()
export class IconComponent extends BaseComponent {
    constructor() {
        super();

        this.applyRootStyle(styles);
    }

    setIcon(name: IconName) {
        const iconSvg = require(`../../../assets/icons/${name}.svg`);
        this.rootElement.innerHTML = iconSvg;
    }
}