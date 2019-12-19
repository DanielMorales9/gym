import {Injectable} from '@angular/core';
import {AuthenticationService} from '../core/authentication';


@Injectable()
export class SpecFacade {

    constructor(private service: AuthenticationService) {
    }

    canEdit() {
        return this.service.getCurrentUserRole() === 1;
    }

    canDisable() {
        return this.service.getCurrentUserRole() === 1;
    }

    canDelete() {
        return this.service.getCurrentUserRole() === 1;
    }
}
