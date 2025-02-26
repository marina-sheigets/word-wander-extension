import { ExtensionPrefix } from "./backgroundMessages";

export enum ChromeStorageKeys {
    Settings = ExtensionPrefix + 'settings',
    History = ExtensionPrefix + 'history',
}