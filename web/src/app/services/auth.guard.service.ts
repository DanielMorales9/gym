import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AppService} from './app.service';


@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(public appService: AppService, public router: Router) {}

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        if (!this.appService.authenticated) {
            await this.router.navigate(['auth', 'login']);
            return false;
        }
        return true;
    }
}
