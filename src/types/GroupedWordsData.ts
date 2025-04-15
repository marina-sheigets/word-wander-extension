import { i18nKeys } from "../services/i18n/i18n-keys";
import { DictionaryTableItem } from "./DictionaryTableItem";

export interface GroupedWordsData {
    [i18nKeys.Today]: DictionaryTableItem[];
    [i18nKeys.Yesterday]: DictionaryTableItem[];
    [i18nKeys.LastWeek]: DictionaryTableItem[];
    [i18nKeys.LastMonth]: DictionaryTableItem[];
    [i18nKeys.Older]: DictionaryTableItem[];
}