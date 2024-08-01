import { SettingsNames } from "./settingsNames";

export const DEFAULT_SETTINGS = {
    [SettingsNames.TargetLanguage]: 'uk',
    [SettingsNames.SourceLanguage]: 'en',
    [SettingsNames.DoubleClick]: true,
    [SettingsNames.ShowSynonyms]: true,
    [SettingsNames.ShowExamples]: true,
    [SettingsNames.PronounceByDefault]: true,
    [SettingsNames.PronunciationSpeed]: 1,
    [SettingsNames.Voice]: 'some_voice',
    [SettingsNames.LanguagesList]: [
        { value: 'en', label: 'English' },
        { value: 'uk', label: 'Ukrainian' }
    ]
}