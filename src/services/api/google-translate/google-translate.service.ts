
export class GoogleTranslateService {
    private readonly BASE_URL = `https://translation.googleapis.com/language/translate/v2?format=text&key=${process.env.GOOGLE_API_KEY}&source=en&target=uk&callback=translateText&q=`;

    public async translateText(text: string) {
        const url = this.BASE_URL + text;

        try {
            const response = await fetch(url, { method: 'POST' });
            const data = await response.json();

            if (!data.data.translations) {
                return '';
            }
            return data.data.translations.map((item: any) => item.translatedText);
        } catch (error) {
            return '';
        }
    }
}