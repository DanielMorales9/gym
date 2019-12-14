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
    credentials: {username: string, password: string};
    user: User;

    constructor(private userService: UserService,
                private userHelperService: UserHelperService,
                private authenticationService: AuthenticationService,
                private authenticatedService: AuthenticatedService) {
        this.loadSessionInfo();
        this.getCurrentRoleView();
    }

    async authenticate(credentials?) {
        let [data, err] = await this.authenticationService.login(credentials);
        console.log(data, err);
        if (data) {
            this.authenticated = true;
            [data, err] = await this.getUser(data['principal']['username']);
            console.log(data, err);

            if (data) {
                this.user = data;
                this.getCurrentRoleView();
                this.saveSessionInfo();
            }

        } else {
            this.authenticated = false;
            this.discardSession();
        }
        this.authenticatedService.setAuthenticated(this.authenticated);
        return [this.authenticated, err];
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

    async logout() {
        const [data, error] = await this.authenticationService.logout();
        if (data) {
            this.discardSession();
        }
        return [data, error];
    }

    private async getUser(email: string) {
        let [data, err] = [undefined, undefined];
        if (!this.user.id) {
            [data, err] = await this.userHelperService.getUserByEmail(email);
        }
        else {
            [data, err] = [this.user, undefined];
        }
        return [data, err];

    }
}
