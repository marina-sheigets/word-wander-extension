import 'reflect-metadata';
import { container } from "tsyringe";
import { BackgroundMessages } from "../constants/backgroundMessages";


class BaseContentScript {
    constructor() {
        addEventListener('message', async (event) => {
            switch (event.data.message) {
                case BackgroundMessages.GoToTrainings: {
                    debugger;
                    chrome.runtime.sendMessage({
                        type: event.data.message,
                        data: event.data.data
                    });
                }

            }
        });
    }
}


container.register('BundleName', {
    useValue: 'base-content-script'
});

container.resolve(BaseContentScript);