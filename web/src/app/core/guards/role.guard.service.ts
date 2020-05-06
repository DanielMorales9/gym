import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AuthenticationService} from '../authentication';

@Injectable()
export class RoleGuardService implements CanActivate {

    constructor(public auth: AuthenticationService, public router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const expectedRole = route.data.expectedRole;
        console.log(expectedRole, this.auth.getCurrentUserRole());
        if (!this.auth.hasRole(expectedRole)) {
            const _ = this.router.navigate(['auth']);
            return false;
        }
        return true;
    }
}
