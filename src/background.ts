import 'reflect-metadata';
import { container, singleton } from "tsyringe";
import { BackgroundMessages } from './constants/backgroundMessages';

const ExtensionPrefix = 'wordWander_';

const AllowedMessages = ['SettingsChanged'];

@singleton()
export class Background {
    constructor() {

        chrome.runtime.onMessage.addListener((request) => {
            if (!request || !request.type || !AllowedMessages.includes(ExtensionPrefix + request.type)) {
                return;
            }

            // process the message
        });

        chrome.storage.onChanged.addListener((changes) => {
            if (changes[ExtensionPrefix + 'settings']) {
                // Notify all tabs that settings have changed
                chrome.tabs.query({}, (tabs) => {
                    if (chrome.runtime.lastError) {
                        console.error('Error querying tabs:', chrome.runtime.lastError);
                    }

                    tabs.forEach((tab) => {
                        if (tab.url && tab.url.indexOf('chrome://') === 0) {
                            return;
                        }

                        chrome.tabs.sendMessage(tab.id || 0, {
                            message: BackgroundMessages.SettingsChanged,
                            data: changes[ExtensionPrefix + 'settings'].newValue
                        }, (response) => {
                            if (chrome.runtime.lastError) {
                                console.error('Error sending message to tab:', chrome.runtime.lastError);
                            } else {
                                console.log('Message sent to tab', tab.id, response);
                            }
                        });
                    });
                });
            }
        });

    }
}

container.register('BundleName', {
    useValue: 'background',
});

container.resolve(Background);
