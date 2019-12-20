import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '../authentication';
import {SnackBarService} from '../utilities';


@Injectable()
export class NoAuthGuardService implements CanActivate {

    constructor(public auth: AuthenticationService, public snackBar: SnackBarService, public router: Router) {}

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        if (this.auth.isAuthenticated()) {
            this.snackBar.open('Esegui il logout prima!');
            return false;
        }
        return true;
    }
}
