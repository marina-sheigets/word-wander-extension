import { i18nKeys } from "../services/i18n/i18n-keys";

export interface Training {
    id: number;
    title: i18nKeys;
    description: i18nKeys;
    name: string;
    minimumAmountOfWords: number
}