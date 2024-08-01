import { singleton } from 'tsyringe';
import * as styles from './settings-popup.component.css'
import { PopupComponent } from '../popup.component';
import { IconService } from '../../../services/icon/icon.component';
import { LanguagesComponent } from './languages/languages.component';
import { TranslationComponent } from './translation/translation.component';
import { PronunciationComponent } from './pronunciation/pronunciation.component';
import { MessengerService } from '../../../services/messenger/messenger.service';
import { Messages } from '../../../constants/messages';
import { ToolbarButtonService } from '../../../services/toolbar-button/toolbar-button.service';

@singleton()
export class SettingsPopupComponent extends PopupComponent {

    private titleHr = document.createElement('hr');
    private languagesHr = document.createElement('hr');
    private translationHr = document.createElement('hr');


    constructor(
        protected iconService: IconService,
        protected languagesComponent: LanguagesComponent,
        protected translationComponent: TranslationComponent,
        protected pronunciationComponent: PronunciationComponent,
        protected messenger: MessengerService,
        protected toolbarButtonService: ToolbarButtonService
    ) {
        super(iconService);

        this.applyRootStyle(styles);

        this.setTitle('Settings');

        this.setContent(this.titleHr);

        this.setContent(this.languagesComponent.rootElement);

        this.setContent(this.languagesHr);

        this.setContent(this.translationComponent.rootElement);

        this.setContent(this.translationHr);

        this.setContent(this.pronunciationComponent.rootElement);

        this.hide();

        this.messenger.subscribe(Messages.OpenSettings, this.show.bind(this));

        this.onClose.subscribe(this.toolbarButtonService.setAllButtonsInactive.bind(this.toolbarButtonService));
    }
}