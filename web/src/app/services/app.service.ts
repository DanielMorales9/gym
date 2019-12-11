import {Injectable} from '@angular/core';
import {UserHelperService, UserService} from '../shared/services';
import {User} from '../shared/model';
import {AuthenticatedService} from './authenticated.service';
import {AuthenticationService} from '../core/authentication/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    currentRole: number;
    authenticated;
    user: User;

    constructor(private userService: UserService,
                private userHelperService: UserHelperService,
                private authenticationService: AuthenticationService,
                private authenticatedService: AuthenticatedService) {
        this.loadSessionInfo();
        this.getCurrentRoleView();
    }

    authenticate(credentials?, success?, error?) {
        this.authenticationService.login(credentials).subscribe( res => {
            this.authenticated = true;
            if (!this.user.id) {
                this.userHelperService.getUserByEmail(res['principal']['username'], user => {
                    this.user = user;
                    this.getCurrentRoleView();
                    this.saveSessionInfo();
                });
            }
            this.authenticatedService.setAuthenticated(this.authenticated);

            return !!success && success(this.authenticated);
        }, err => {
            this.discardSession();
            return !!error && error(err);
        });
    }


    private getCurrentRoleView() {
        this.currentRole = this.userHelperService.getHighestRole(this.user);
    }

    private saveSessionInfo() {
        localStorage.setItem('authenticated', JSON.stringify(this.authenticated));
        localStorage.setItem('user', JSON.stringify(this.user));
    }

    private loadSessionInfo() {
        this.authenticated = JSON.parse(localStorage.getItem('authenticated')) || false;
        this.user = JSON.parse(localStorage.getItem('user')) || new User();
    }

    public discardSession() {
        this.authenticated = false;
        this.user = new User();
        this.saveSessionInfo();
        this.authenticatedService.setAuthenticated(this.authenticated);
    }

    logout(callback) {
        this.authenticationService.logout().subscribe(_ => {
                this.discardSession();
            },
            undefined, () => {
                return !!callback && callback();
            });
    }

}
