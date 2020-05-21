import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AuthenticationService} from '../authentication';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable()
export class RoleGuardService implements CanActivate {

    constructor(public auth: AuthenticationService, public router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        const expectedRole = route.data.expectedRole;

        return this.auth.authenticate().pipe(map(
            d => {
                if (!d || !this.auth.hasRole(expectedRole)) {
                    const _ = this.router.navigate(['auth']);
                    return false;
                }
                return true;
            }
        ));

    }
}
