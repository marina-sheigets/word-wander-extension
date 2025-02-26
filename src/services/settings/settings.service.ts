import { singleton } from "tsyringe";
import { MessengerService } from "../messenger/messenger.service";
import { BackgroundMessages } from "../../constants/backgroundMessages";
import { ExtensionPageManagerService } from "../extension-page-manager/extension-page-manager.service";
import { SettingsNames } from "../../constants/settingsNames";

@singleton()
export class SettingsService {
    private callbacks: Map<string, Function[]> = new Map();
    private settings: { [key: string]: any } = {};

    constructor(
        private messenger: MessengerService,
        protected extensionPageManagerService: ExtensionPageManagerService,
    ) {
        if (chrome.storage) {
            // for getting initial settings 
            this.extensionPageManagerService.detectSettingsChange((settings: { [key: string]: any }) => {
                this.settings = settings;
                this.informAll();
            });

            // for updating settings when user changes them
            this.extensionPageManagerService.getSettingsForExtensionPage().then(settings => {
                this.settings = settings;
                this.informAll();
            });
        } else {
            this.messenger.asyncSendToBackground(BackgroundMessages.GetSettings);

            this.listenToSettingsUpdates();
        }
    }

    private listenToSettingsUpdates() {
        addEventListener('message', (event) => {
            if (event.data.message === BackgroundMessages.SyncSettings) {
                this.settings = event.data.data;
                this.informAll();
            }
        });
    }

    subscribe(key: SettingsNames, callback: Function) {
        if (!this.callbacks.has(key)) {
            this.callbacks.set(key, []);
        }
        this.callbacks.get(key)!.push(callback);
    }

    follow(key: SettingsNames, callback: Function) {
        this.subscribe(key, callback);
        callback(this.get(key));
    }

    get(key: SettingsNames) {
        return this.settings[key];
    }

    set(key: SettingsNames, value: any) {
        this.settings[key] = value;
        this.messenger.asyncSendToBackground(BackgroundMessages.UpdateSettings, { [key]: value });
        this.inform(key);
    }

    batchUpdate(updates: { [key: string]: any }) {
        Object.assign(this.settings, updates);
        this.messenger.asyncSendToBackground(BackgroundMessages.UpdateSettings, updates);
        this.informAll();
    }

    private inform(key: SettingsNames) {
        const callbacks = this.callbacks.get(key);
        if (callbacks) {
            callbacks.forEach(callback => callback(this.settings[key]));
        }
    }

    private informAll() {
        for (const key of Object.keys(this.settings)) {
            this.inform(key as SettingsNames);
        }
    }

    getAllSettings() {
        return this.settings;
    }
}