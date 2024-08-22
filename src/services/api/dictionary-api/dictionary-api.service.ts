import { singleton } from "tsyringe";
import { SettingsService } from "../../settings/settings.service";
import { SettingsNames } from "../../../constants/settingsNames";

interface DictionaryData {
    [partOfSpeech: string]: {
        usage: string[];
        meaning: string[];
    } | string[],
    synonyms: string[];
}

interface DictionaryResponse {
    [word: string]: {
        meanings: MeaningResponse[];
        synonyms: string[];
    }[];
};


interface MeaningResponse {
    partOfSpeech: string;
    definitions: {
        definition: string;
        synonyms: string[];
    }
}

interface RandomWord {
    definition: string,
    word: string,
    example: string
}
@singleton()
export class DictionaryApiService {
    private readonly baseUrl = "https://api.dictionaryapi.dev/api/v2/entries/";
    private readonly urbanDictionaryUrl = "https://api.urbandictionary.com/v0/random";

    constructor(
        protected settingsService: SettingsService,
    ) {

    }

    public async getRandomWord(): Promise<any> {
        try {
            const response = await fetch(this.urbanDictionaryUrl);
            const json = await response.json();

            if (json.list && json.list.length) {
                const singleWord = this.getSingleWord(json.list);
                if (!singleWord) {
                    return null;
                }

                return this.formatRandomWord(singleWord);
            }
        } catch (error) {
            return null;
        }
    }

    private formatRandomWord(item: RandomWord) {
        return {
            word: item.word.replace(/[\[\]']+/g, ''), // remove unnecessary square brackets
            dictionaryResult: [{
                unknown: {
                    meaning: [item.definition],
                    usage: [item.example.replace(/[\[\]']+/g, '')] // remove unnecessary square brackets
                },
            }]
        }
    }

    private getSingleWord(list: RandomWord[]) {
        return list.find((item: RandomWord) => item.word.split(' ').length === 1);
    }

    private formatData(data: any): DictionaryData[] {
        const result: DictionaryData[] = [];

        data.map((item: DictionaryResponse) => {
            const resultObject: DictionaryData = {
                synonyms: []
            };

            const meanings = item.meanings;
            const synonyms = meanings.map((definition: any) => definition.synonyms);

            meanings.forEach((item: any) => {

                const partOfSpeech = item.partOfSpeech;
                const definitions = item.definitions;
                const meaning = definitions.map((definition: any) => definition.definition);
                let usage = definitions.map((definition: any) => definition.example);
                usage = usage.filter((item: any) => item);

                resultObject[partOfSpeech] = {
                    usage,
                    meaning,
                }

            });
            resultObject.synonyms = synonyms;
            result.push(resultObject);
        })


        return result;
    }

    async fetchData(word: string): Promise<any> {
        const url = `${this.baseUrl}${this.settingsService.get(SettingsNames.SourceLanguage)}/${word}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.title) {
                return null;
            }

            return this.formatData(data);
        } catch (error) {
            return null;
        }
    }

}