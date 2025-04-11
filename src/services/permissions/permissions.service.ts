import { singleton } from "tsyringe";
import { SettingsService } from "../settings/settings.service";
import { SettingsNames } from "../../constants/settingsNames";

@singleton()
export class PermissionsService {

    constructor(
        protected settings: SettingsService,
    ) { }

    public isSynonymsEnabled() {
        return this.settings.get(SettingsNames.ShowSynonyms);
    }

    public isUsageEnabled() {
        return this.settings.get(SettingsNames.ShowExamples);
    }

    public isPronounceWithDoubleClickedEnabled() {
        return this.settings.get(SettingsNames.PronounceWithDoubleClick);
    }

    public isSoundEnabled() {
        return this.settings.get(SettingsNames.SoundInTrainings)
    }
}