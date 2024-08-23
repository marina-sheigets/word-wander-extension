import { injectable } from 'tsyringe';
import logoImg from '../../../../assets/logo.webp';
import { BaseComponent } from '../../base-component/base-component';
import * as styles from './toolbar-logo.component.css';
import { TOOLBAR_MODE, ToolbarService } from '../../../services/toolbar/toolbar.service';


@injectable()
export class ToolbarLogoComponent extends BaseComponent {
    logo = document.createElement('img');

    constructor(
        protected toolbarService: ToolbarService,
    ) {
        super(styles);

        this.addLogoImage();


        this.rootElement.append(this.logo);

        this.rootElement.addEventListener('mouseup', () => {
            if (this.toolbarService.getMode() === TOOLBAR_MODE.DRAGGABLE) {
                this.toolbarService.setToolbarMode(TOOLBAR_MODE.MINIMIZED);
            } else {
                this.toolbarService.setToolbarMode(TOOLBAR_MODE.DRAGGABLE);
            }
        });
    }

    private addLogoImage() {
        this.logo.src = logoImg;
        this.logo.width = 50;
        this.logo.height = 50;
    }
}