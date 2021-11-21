import {Directive, Injectable} from '@angular/core';
import {StorageService} from './storage.service';
import {User} from '../../shared/model';

@Directive()
@Injectable({
    providedIn: 'root'
})
export class UserStorageDirective {
    private readonly USER_KEY = 'user';

    constructor(private storageService: StorageService) {
    }

    get(): User {
        return this.storageService.get(this.USER_KEY);
    }

    set(user: User) {
        this.storageService.set(this.USER_KEY, user);
    }

    unset() {
        this.storageService.set(this.USER_KEY);
    }
}
