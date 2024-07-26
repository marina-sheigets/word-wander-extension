
export class SearchService {

    async searchWord(word: string) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(false), 3000);
        })
    }
}