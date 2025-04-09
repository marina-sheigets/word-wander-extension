import { injectable } from "tsyringe";
import { I18nService } from "../../../services/i18n/i18n.service";
import { SwitchComponent } from "../switch.component";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { SettingsService } from "../../../services/settings/settings.service";
import { SettingsNames } from "../../../constants/settingsNames";
import * as styles from './auto-sound.switch.css';

@injectable()
export class AutoSoundSwitch extends SwitchComponent {
    constructor(
        protected i18n: I18nService,
        protected settingsService: SettingsService
    ) {
        super(i18n);

        this.applyRootStyle(styles);
        this.setLabel(i18nKeys.SoundInTrainings);

        this.onSwitch.subscribe(() => {
            this.toggleSound();
        });

        this.settingsService.subscribe((SettingsNames.SoundInTrainings), (value: boolean) => {
            this.setValue(value);
        })
    }

    private toggleSound() {
        const previousValue = this.settingsService.get(SettingsNames.SoundInTrainings);

        this.settingsService.set(SettingsNames.SoundInTrainings, !previousValue);
    }
}