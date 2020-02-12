import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '../authentication';


@Injectable()
export class NoAuthGuardService implements CanActivate {

    constructor(public auth: AuthenticationService, public router: Router) {}

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        const [d, _] = await this.auth.authenticate();
        if (!!d) {
            await this.router.navigateByUrl(d.authorities[0].authority.toLowerCase());
        }
        return !d;
    }
}
