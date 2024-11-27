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
    DictionarySync: ExtensionPrefix + 'DictionarySync',
    WordAddedToDictionarySync: ExtensionPrefix + 'WordAddedToDictionarySync',
}