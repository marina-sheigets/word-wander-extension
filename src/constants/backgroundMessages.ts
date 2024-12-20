export const ExtensionPrefix = 'wordWander_';

export const BackgroundMessages = {
    //settings 
    UpdateSettings: ExtensionPrefix + 'UpdateSettings',
    SettingsChanged: ExtensionPrefix + 'SettingsChanged',
    SyncSettings: ExtensionPrefix + 'SyncSettings',
    GetSettings: ExtensionPrefix + 'GetSettings',

    //history
    GetHistory: ExtensionPrefix + 'GetHistory',
    HistoryChanged: ExtensionPrefix + 'HistoryChanged',
    SyncHistory: ExtensionPrefix + 'SyncHistory',
    UpdateHistory: ExtensionPrefix + 'UpdateHistory',

    GoToTrainings: ExtensionPrefix + 'GoToTrainings',

    //auth
    UserAuthorized: ExtensionPrefix + 'UserAuthorized',

    //dictionary
    WordAddedToDictionary: ExtensionPrefix + 'WordAddedToDictionary',
    DictionarySync: ExtensionPrefix + 'DictionarySync',
}