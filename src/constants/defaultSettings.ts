import { InterfaceLanguage } from "../types/InterfaceLanguage";
import { SettingsNames } from "./settingsNames";

export const DEFAULT_SETTINGS = {
    [SettingsNames.TargetLanguage]: 'uk',
    [SettingsNames.SourceLanguage]: 'en',
    [SettingsNames.PronounceWithDoubleClick]: true,
    [SettingsNames.ShowSynonyms]: true,
    [SettingsNames.ShowExamples]: true,
    [SettingsNames.AutoPronounceInTraining]: true,
    [SettingsNames.PronunciationSpeed]: "5",
    [SettingsNames.Voice]: '',
    [SettingsNames.Voices]: [],
    [SettingsNames.LanguagesList]: [
        { value: 'en', label: 'English' },
        { value: 'uk', label: 'Ukrainian' }
    ],
    [SettingsNames.InterfaceLanguage]: InterfaceLanguage.Ukrainian,
    [SettingsNames.User]: null,
}