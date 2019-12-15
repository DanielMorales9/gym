import {Injectable} from '@angular/core';
import {UserHelperService, UserService} from '../core/controllers';
import {User} from '../shared/model';
import {AuthenticatedService} from './authenticated.service';
import {AuthenticationService} from '../core/authentication';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    currentRole: number;
    authenticated;
    credentials: {username: string, password: string};
    user: User;

    constructor(private userService: UserService,
                private userHelperService: UserHelperService,
                private authenticationService: AuthenticationService,
                private authenticatedService: AuthenticatedService) {
        this.loadAuthenticationInfo();
        this.getCurrentRoleView();
    }

    async authenticate(credentials?) {
        console.log(credentials);
        const [data, err] = await this.authenticationService.login(credentials);
        console.log(data, err);
        if (data) {
            this.authenticated = true;
            this.user = data;
            this.getCurrentRoleView();

        } else {
            this.discardSession();
        }
        this.authenticatedService.setAuthenticated(this.authenticated);
        return [this.authenticated, err];
    }


    private getCurrentRoleView() {
        this.currentRole = this.userHelperService.getHighestRole(this.user);
    }

    private loadAuthenticationInfo() {
        this.authenticated = this.authenticationService.isAuthenticated();
        this.user = this.authenticationService.getUser();
    }

    public discardSession() {
        this.user = new User();
        this.authenticated = false;
        this.authenticatedService.setAuthenticated(this.authenticated);
    }

    async logout() {
        const [data, error] = await this.authenticationService.logout();
        if (data) {
            this.discardSession();
        }
        return [data, error];
    }

}
