import {Injectable} from '@angular/core';
import {AppService} from './app.service';


@Injectable()
export class SpecFacade {

    constructor(private service: AppService) {
    }

    canEdit() {
        return this.service.currentRole === 1;
    }

    canDisable() {
        return this.service.currentRole === 1;
    }

    canDelete() {
        return this.service.currentRole === 1;
    }
}
