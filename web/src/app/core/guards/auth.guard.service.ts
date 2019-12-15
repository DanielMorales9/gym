import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '../authentication';


@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(public auth: AuthenticationService, public router: Router) {}

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        if (!this.auth.isAuthenticated()) {
            await this.router.navigate(['auth', 'login']);
            return false;
        }
        return true;
    }
}
