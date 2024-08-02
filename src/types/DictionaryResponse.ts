
export interface DictionaryResponse {
    meanings: Meaning[];
}

export interface Meaning {
    partOfSpeech: string;
    definitions: Definition[];
}

export interface Definition {
    definition: string;
    synonyms: string[];
}