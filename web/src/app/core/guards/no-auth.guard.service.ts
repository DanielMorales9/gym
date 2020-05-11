import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '../authentication';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';


@Injectable()
export class NoAuthGuardService implements CanActivate {

    constructor(public auth: AuthenticationService, public router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.auth.authenticate().pipe(map(
            d => {
                if (!!d) {
                    this.router.navigateByUrl(d.authorities[0].authority.toLowerCase());
                }
                return !d;
            }
        ));
    }
}
