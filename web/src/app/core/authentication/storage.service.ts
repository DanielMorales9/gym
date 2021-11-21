import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';

/**
 * Provides storage
 */
@Injectable({
    providedIn: 'root'
})
export class StorageService {

    private readonly TTL = environment.production ? 10000 : 0;


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

    setWithExpiry(key, value, ttl = this.TTL) {
        const now = new Date();

        // `item` is an object which contains the original value
        // as well as the time when it's supposed to expire
        const item = {
            value: value,
            expiry: now.getTime() + ttl
        };
        this.set(key, item);
    }

    getWithExpiry(key) {
        const item = this.get(key);
        // if the item doesn't exist, return null
        if (!item) {
            return null;
        }
        const now = new Date();
        // compare the expiry time of the item with the current time
        if (now.getTime() > item.expiry) {
            // If the item is expired, delete the item from storage
            // and return null
            this.set(key);
            return null;
        }
        return item.value;
    }
}
