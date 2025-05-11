import { i18nKeys } from "../services/i18n/i18n-keys";
import { CollectionData } from "./CollectionData";
import { DictionaryTableItem } from "./DictionaryTableItem";

export interface GroupedWordsByDateData {
    [i18nKeys.Today]: DictionaryTableItem[];
    [i18nKeys.Yesterday]: DictionaryTableItem[];
    [i18nKeys.LastWeek]: DictionaryTableItem[];
    [i18nKeys.LastMonth]: DictionaryTableItem[];
    [i18nKeys.Older]: DictionaryTableItem[];
}

export interface GroupedWordsByCollectionData {
    [collectionName: string]: CollectionData
}