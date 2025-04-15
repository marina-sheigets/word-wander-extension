import { DictionaryTableItem } from "./DictionaryTableItem";

export interface GroupedWordsData {
    Today: DictionaryTableItem[];
    Yesterday: DictionaryTableItem[];
    LastWeek: DictionaryTableItem[];
    LastMonth: DictionaryTableItem[];
    Older: DictionaryTableItem[];
}