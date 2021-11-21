import {Directive, Injectable} from '@angular/core';
import {StorageService} from './storage.service';
import {User} from '../../shared/model';

@Directive()
@Injectable({
    providedIn: 'root'
})
export class CurrentUserRoleIdStorageDirective {
    private readonly CURRENT_ROLE_ID = 'currentRoleId';

    constructor(private storageService: StorageService) {
    }

    get(): number {
        return this.storageService.get(this.CURRENT_ROLE_ID);
    }

    set(id: number) {
        this.storageService.set(this.CURRENT_ROLE_ID, id);
    }

    unset() {
        this.storageService.set(this.CURRENT_ROLE_ID);
    }
}
