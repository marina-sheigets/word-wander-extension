import { SettingsNames } from "./settingsNames";

export const DEFAULT_SETTINGS = {
    [SettingsNames.TargetLanguage]: 'uk',
    [SettingsNames.SourceLanguage]: 'en',
    [SettingsNames.PronounceWithDoubleClick]: true,
    [SettingsNames.TranslateWithDoubleClick]: true,
    [SettingsNames.ShowSynonyms]: true,
    [SettingsNames.ShowExamples]: true,
    [SettingsNames.PronounceByDefault]: true,
    [SettingsNames.PronunciationSpeed]: "5",
    [SettingsNames.Voice]: '',
    [SettingsNames.Voices]: [],
    [SettingsNames.LanguagesList]: [
        { value: 'en', label: 'English' },
        { value: 'uk', label: 'Ukrainian' }
    ]
}