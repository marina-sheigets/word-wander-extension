import { singleton } from "tsyringe";

@singleton()
export class LocalStorageService {
    key = 'word-wander_';

    public get(field: string) {
        return localStorage.getItem(this.key + field);
    }

    public set(field: string, value: string) {
        localStorage.setItem(this.key + field, value);
    }

    public delete(field: string) {
        localStorage.removeItem(this.key + field);
    }
}