import { singleton } from "tsyringe";
import { STORAGE_KEYS } from "../../constants/localStorage-keys";

@singleton()
export class LocalStorageService {
    key = 'word-wander_';

    public get(field: STORAGE_KEYS) {
        return localStorage.getItem(this.key + field);
    }

    public set(field: STORAGE_KEYS, value: string) {
        localStorage.setItem(this.key + field, value);
    }

    public delete(field: STORAGE_KEYS) {
        localStorage.removeItem(this.key + field);
    }
}