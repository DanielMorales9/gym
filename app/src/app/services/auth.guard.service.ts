import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AppService} from "./app.service";

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(public auth: AppService, public router: Router) {
    }

    canActivate(): boolean {
        if (!this.auth.authenticated) {
            console.log(this.auth.authenticated);
            this.router.navigate(['auth', 'login']);
            return false;
        }
        return true;
    }
}
