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

    sendToBackground(message: string, setting?: { [key: string]: any }) {
        window.postMessage({ message, data: setting });
    }
}