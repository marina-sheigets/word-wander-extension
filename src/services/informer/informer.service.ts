
export class Informer<T> {
    callbacks = new Array<(value?: T) => void>();

    inform(value?: T) {
        for (var callback of this.callbacks) {
            callback(value);
        }
    }

    follow(callback: (value?: T) => void) {
        this.subscribe(callback);
        callback();
    }

    subscribe(callback: (value: T) => void) {
        this.callbacks.push(callback);
    }

    unsubscribe(callback: (value: T) => void) {
        let index = this.callbacks.indexOf(callback);
        if (index !== -1) {
            this.callbacks.splice(index, 1);
        }
    }
}
