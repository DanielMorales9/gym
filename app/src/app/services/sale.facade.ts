import {Injectable} from '@angular/core';
import {AppService} from './app.service';

@Injectable()
export class SaleFacade {

    constructor(private appService: AppService) {
    }

    canPay() {
        return this.appService.current_role_view === 1;
    }

    canDelete() {
        return this.appService.current_role_view === 1;
    }
}
