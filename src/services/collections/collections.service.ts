import { singleton } from "tsyringe";
import { HttpService } from "../http/http.service";
import { URL } from "../../constants/urls";

@singleton()
export class CollectionsService {
    constructor(
        protected httpService: HttpService
    ) {

    }

    public async getAllCollections() {
        try {
            const response = await this.httpService.get(URL.collections.getCollections);

            return response?.data.collections;
        } catch {
            return [];
        }
    }

    public async addWordToCollections(wordId: string, collectionsNames: string[]) {
        return await this.httpService.post(URL.collections.addWordToCollections, { wordId, collectionsNames });
    }
}