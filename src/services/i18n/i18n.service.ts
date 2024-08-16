import { singleton } from 'tsyringe';
import { SettingsNames } from '../../constants/settingsNames';
import { SettingsService } from '../settings/settings.service';
import { i18nKeys } from './i18n-keys';
import translations from './translations.json';
import { InterfaceLanguage } from '../../types/InterfaceLanguage';

@singleton()
export class I18nService {
    protected interfaceLanguage: InterfaceLanguage = InterfaceLanguage.English;
    private subscribers: { [key: string]: Function[] } = {};

    constructor(
        protected settings: SettingsService,
    ) {
        this.settings.subscribe(SettingsNames.InterfaceLanguage, this.onInterfaceLanguageChange.bind(this));
    }

    private onInterfaceLanguageChange(language: InterfaceLanguage) {
        this.interfaceLanguage = language;
        this.inform();
    }

    inform(label?: string) {
        if (!label) {
            for (const key in this.subscribers) {
                this.inform(key);
            }
            return;
        }

        const eventSubscribers = this.subscribers[label];
        if (eventSubscribers) {
            eventSubscribers.forEach(subscriber => subscriber(translations[label][this.interfaceLanguage]));
        }
    }

    follow(key: i18nKeys, callback: (value?: any) => void) {
        this.subscribe(key, callback);
        callback(translations[key][this.interfaceLanguage]);
    }

    subscribe(key: string, callback: Function) {
        if (!this.subscribers[key]) {
            this.subscribers[key] = [];
        }
        this.subscribers[key].push(callback);
    }

    unsubscribe(message: string, callback: Function) {
        const eventSubscribers = this.subscribers[message];
        if (eventSubscribers) {
            this.subscribers[message] = eventSubscribers.filter(subscriber => subscriber !== callback);
        }
    }

}