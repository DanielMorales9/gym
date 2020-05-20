import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '../authentication';


@Injectable()
export class NoAuthGuardService implements CanActivate {

    constructor(public auth: AuthenticationService, public router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const auth = this.auth.isAuthenticated();
        if (auth) {
            this.router.navigateByUrl(this.auth.getUserRoleName());
        }
        return !auth;
    }
}
