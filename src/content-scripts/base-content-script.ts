import 'reflect-metadata';
import { container } from "tsyringe";
import { BackgroundMessages } from "../constants/backgroundMessages";


class BaseContentScript {
    constructor() {
        addEventListener('message', async (event) => {
            switch (event.data.message) {
                case BackgroundMessages.GoToTrainings: {
                    chrome.runtime.sendMessage({
                        type: event.data.message,
                        data: event.data.data
                    });
                    break;
                }
                case BackgroundMessages.WordAddedToDictionary:
                case BackgroundMessages.CloseAllSignInPopups:
                    {
                        chrome.runtime.sendMessage({
                            type: BackgroundMessages.DictionarySync,
                            data: event.data.data
                        });
                        break;
                    }
            }
        });

        chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
            if (!request || !request.message || !Object.values(BackgroundMessages).includes(request.message)) {
                console.error('Invalid request:', request);
                return;
            }

            postMessage({ message: request.message, data: request.data });
            sendResponse(true);
        });
    }
}


container.register('BundleName', {
    useValue: 'base-content-script'
});

container.resolve(BaseContentScript);