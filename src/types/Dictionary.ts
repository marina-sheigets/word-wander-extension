export interface Dictionary {
    interjection?: WordDictionary;
    adjective?: WordDictionary;
    noun?: WordDictionary,
    verb?: WordDictionary,
    preposition?: WordDictionary,
    conjunction?: WordDictionary,
    unknown?: WordDictionary,
    synonyms: Array<string[]>;
}

export interface WordDictionary {
    usage: string[];
    meaning: string[];
}