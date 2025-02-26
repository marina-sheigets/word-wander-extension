export const ExtensionPrefix = 'wordWander_';

export enum BackgroundMessages {
    //settings 
    UpdateSettings = ExtensionPrefix + 'UpdateSettings',
    SettingsChanged = ExtensionPrefix + 'SettingsChanged',
    SyncSettings = ExtensionPrefix + 'SyncSettings',
    GetSettings = ExtensionPrefix + 'GetSettings',

    //history
    GetHistory = ExtensionPrefix + 'GetHistory',
    HistoryChanged = ExtensionPrefix + 'HistoryChanged',
    SyncHistory = ExtensionPrefix + 'SyncHistory',
    UpdateHistory = ExtensionPrefix + 'UpdateHistory',

    GoToTrainings = ExtensionPrefix + 'GoToTrainings',

    //auth
    UserAuthorized = ExtensionPrefix + 'UserAuthorized',
    CloseAllSignInPopups = ExtensionPrefix + 'CloseAllSignInPopups',
    SyncAllAuthPopupsClosed = ExtensionPrefix + 'SyncAllAuthPopupsClosed',

    //dictionary
    WordAddedToDictionary = ExtensionPrefix + 'WordAddedToDictionary',
    DictionarySync = ExtensionPrefix + 'DictionarySync',
}