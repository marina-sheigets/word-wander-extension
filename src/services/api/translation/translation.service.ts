import { singleton } from 'tsyringe';
import { URL } from '../../../constants/urls';
import { HttpService } from '../../http/http.service';

@singleton()
export class TranslationService {
	constructor(protected httpService: HttpService) {}

	public async translateText(text: string, context?: string) {
		try {
			const response = await this.httpService.post(URL.translation.translate, {
				text,
				context,
			});

			const data = await response;
			if (data?.data.text) {
				return data.data.text;
			}
			throw new Error('Translation failed');
		} catch (error) {
			throw error;
		}
	}
}
