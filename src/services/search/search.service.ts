
export class SearchService {

    async searchWord(word: string): Promise<string> {
        return new Promise((resolve) => {
            setTimeout(() => resolve("Hello"), 3000);
        });
    }
}