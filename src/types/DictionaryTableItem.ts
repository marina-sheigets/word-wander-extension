import { Word } from "./Word";

export interface DictionaryTableItem extends Word {
    selected: boolean;
    added: string;
}