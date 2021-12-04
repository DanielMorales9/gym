import {Directive, Injectable} from '@angular/core';
import {StorageService} from './storage.service';
import {Gym} from '../../shared/model';

@Directive()
@Injectable({
    providedIn: 'root'
})
export class GymStorageDirective {
    private readonly GYM_KEY = 'gym';

    constructor(private storageService: StorageService) {
    }

    get(): Gym {
        return this.storageService.get(this.GYM_KEY);
    }

    set(gym: Gym) {
        this.storageService.set(this.GYM_KEY, gym);
    }

    unset() {
        this.storageService.set(this.GYM_KEY);
    }
}
