import { singleton } from "tsyringe";
import { Messages } from "../../constants/messages";

@singleton()
export class MessengerService {
    private subscribers: { [key: string]: Function[] } = {};

    subscribe(message: string, callback: Function) {
        if (!this.subscribers[message]) {
            this.subscribers[message] = [];
        }
        this.subscribers[message].push(callback);
    }

    unsubscribe(message: string, callback: Function) {
        const eventSubscribers = this.subscribers[message];
        if (eventSubscribers) {
            this.subscribers[message] = eventSubscribers.filter(subscriber => subscriber !== callback);
        }
    }

    send(message: Messages, data?: any) {
        const eventSubscribers = this.subscribers[message];
        if (eventSubscribers) {
            eventSubscribers.forEach(subscriber => subscriber(data));
        }
    }

    asyncSendToBackground(message: string, setting?: { [key: string]: any }) {
        window.postMessage({ message, data: setting })
    }

    sendToBackground(message: string, responseMessage?: string, setting?: { [key: string]: any }): Promise<any> {
        return new Promise((resolve, reject) => {

            const listener = (event: MessageEvent) => {
                if (event.data.message === responseMessage) {
                    window.removeEventListener('message', listener);
                    if (event.data.error) {
                        reject(event.data.error);
                    } else {
                        resolve(event.data.data);
                    }
                }
            };

            window.addEventListener('message', listener);

            window.postMessage({ message, data: setting });
        });
    }


    subscribeOnBackgroundMessage(message: string, callback: (data: any) => void) {
        window.addEventListener('message', (event) => {
            if (event.data.message === message) {
                callback(event.data.data);
            }
        })
    }
}