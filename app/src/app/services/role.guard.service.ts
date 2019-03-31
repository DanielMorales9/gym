import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AppService} from "./app.service";

@Injectable()
export class RoleGuardService implements CanActivate {

    constructor(public auth: AppService, public router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const expectedRole = route.data.expectedRole;

        if (!this.auth.authenticated || this.auth.user.type !== expectedRole) {
            let _ = this.router.navigate(['/auth/login']);
            return false;
        }
        return true;
    }
}