import { injectable } from 'tsyringe';
import logoImg from '../../../../assets/logo.png';
import { BaseComponent } from '../../base-component/base-component';
import * as styles from './toolbar-logo.component.css';


@injectable()
export class ToolbarLogoComponent extends BaseComponent {
    logo = document.createElement('img');

    constructor() {
        super();

        this.applyRootStyle(styles);
        this.addClassNamesToComponents(styles);

        this.addLogoImage();


        this.rootElement.append(this.logo);
    }

    private addLogoImage() {
        this.logo.src = logoImg;
        this.logo.width = 30;
        this.logo.height = 30;
    }
}