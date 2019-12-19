import {Injectable} from '@angular/core';

/**
 * Provides storage
 */
@Injectable({
    providedIn: 'root'
})
export class StorageService {

    set(key: string, object?: Object, remember?: boolean) {
        if (object) {
            const storage = remember ? localStorage : sessionStorage;
            storage.setItem(key, JSON.stringify(object));
        } else {
            sessionStorage.removeItem(key);
            localStorage.removeItem(key);
        }
    }

    get(key: string) {
        const item = sessionStorage.getItem(key) || localStorage.getItem(key);
        if (item) {
            return JSON.parse(item);
        }
        return;
    }
}
