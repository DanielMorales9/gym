import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationDirective} from '../authentication';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';


@Injectable()
export class NoAuthGuardService implements CanActivate {

    constructor(public auth: AuthenticationDirective, public router: Router) {}

    private static getAuthority(auth) {
        return auth.authorities[0].authority.toLowerCase();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.auth.authenticate().pipe(map(auth => {
            if (auth) {
                this.router.navigateByUrl(NoAuthGuardService.getAuthority(auth));
            }
            return !auth;
        }));
    }
}
