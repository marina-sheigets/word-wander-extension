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
@singleton()
export class DictionaryApiService {
    private readonly baseUrl = "https://api.dictionaryapi.dev/api/v2/entries/";
    constructor(
        protected settingsService: SettingsService,
    ) {

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