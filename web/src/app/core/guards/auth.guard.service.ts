import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '../authentication';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';


@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(public auth: AuthenticationService, public router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.auth.authenticate().pipe(map(
            d => {
                if (!d) {
                    this.router.navigate(['auth', 'login']);
                }
                return !!d;
            }
        ));
    }
}
