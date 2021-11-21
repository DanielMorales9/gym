import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AuthenticationDirective} from '../authentication';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable()
export class RoleGuardService implements CanActivate {

    constructor(public auth: AuthenticationDirective, public router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        const expectedRole = route.data.expectedRole;
        return this.auth.authenticate().pipe(map(auth => {
            return !!auth ? this.hasRole(auth, expectedRole) : false;
        }));
    }

    private hasRole(auth: any, expectedRole: any): boolean {
        return auth.authorities.map(v => v.authority).filter(v => expectedRole === v).length > 0;
    }
}
