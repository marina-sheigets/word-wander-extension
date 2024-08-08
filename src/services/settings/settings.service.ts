import { singleton } from "tsyringe";
import { MessengerService } from "../messenger/messenger.service";
import { BackgroundMessages } from "../../constants/backgroundMessages";
import { DEFAULT_SETTINGS } from "../../constants/defaultSettings";

@singleton()
export class SettingsService {
    private callbacks: Map<string, Function[]> = new Map();
    private settings: { [key: string]: any } = {};

    constructor(
        private messenger: MessengerService
    ) {
        this.messenger.sendToBackground(BackgroundMessages.GetSettings);

        window.addEventListener('message', (event) => {
            if (event.data.message === BackgroundMessages.SyncSettings) {
                this.settings = event.data.data || DEFAULT_SETTINGS;
                this.informAll();
            }
        });
    }

    subscribe(key: string, callback: Function) {
        if (!this.callbacks.has(key)) {
            this.callbacks.set(key, []);
        }
        this.callbacks.get(key)!.push(callback);
    }

    follow(key: string, callback: Function) {
        this.subscribe(key, callback);
        callback(this.get(key));
    }

    get(key: string) {
        return this.settings[key];
    }

    set(key: string, value: any) {
        this.settings[key] = value;
        this.messenger.sendToBackground(BackgroundMessages.UpdateSettings, { [key]: value });
        this.inform(key);
    }

    batchUpdate(updates: { [key: string]: any }) {
        Object.assign(this.settings, updates);
        this.messenger.sendToBackground(BackgroundMessages.UpdateSettings, updates);
        this.informAll();
    }

    private inform(key: string) {
        const callbacks = this.callbacks.get(key);
        if (callbacks) {
            callbacks.forEach(callback => callback(this.settings[key]));
        }
    }

    private informAll() {
        for (const key of Object.keys(this.settings)) {
            this.inform(key);
        }
    }

    getAllSettings() {
        return this.settings;
    }
}