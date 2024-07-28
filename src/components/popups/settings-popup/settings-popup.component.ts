import { singleton } from 'tsyringe';
import * as styles from './settings-popup.component.css'
import { PopupComponent } from '../popup.component';
import { IconService } from '../../../services/icon/icon.component';
import { LanguagesComponent } from './languages/languages.component';
import { TranslationComponent } from './translation/translation.component';
import { PronunciationComponent } from './pronunciation/pronunciation.component';

@singleton()
export class SettingsPopupComponent extends PopupComponent {

    private titleHr = document.createElement('hr');
    private languagesHr = document.createElement('hr');
    private translationHr = document.createElement('hr');
    private pronunciationHr = document.createElement('hr');


    constructor(
        protected iconService: IconService,
        protected languagesComponent: LanguagesComponent,
        protected translationComponent: TranslationComponent,
        protected pronunciationComponent: PronunciationComponent
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

        this.setContent(this.pronunciationHr);

    }
}