import {Injectable} from '@angular/core';
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

    constructor(private auth: AuthenticationService,
                private authenticatedService: AuthenticatedService) {
        this.loadAuthenticationInfo();
        this.getCurrentRoleView();
    }

    async authenticate(credentials?) {
        const [data, err] = await this.auth.login(credentials);
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
        this.currentRole = this.auth.getCurrentUserRole();
    }

    private loadAuthenticationInfo() {
        this.authenticated = this.auth.isAuthenticated();
        this.user = this.auth.getUser();
    }

    public discardSession() {
        this.user = new User();
        this.currentRole = undefined;
        this.authenticated = false;
        this.authenticatedService.setAuthenticated(this.authenticated);
    }

    async logout() {
        const [data, error] = await this.auth.logout();
        this.discardSession();
        return [data, error];
    }

}
