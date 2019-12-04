import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserHelperService, UserService} from '../shared/services';
import {User} from '../shared/model';
import {AuthenticatedService} from './authenticated.service';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    currentRole: number;
    credentials: { username: string, password: string };
    authenticated;
    user: User;

    // private SOCKET_PATH = '/socket';
    // private stompClient : Stomp;


    constructor(private http: HttpClient,
                private userService: UserService,
                private userHelperService: UserHelperService,
                private authenticatedService: AuthenticatedService) {
        this.loadSessionInfo();
        this.getCurrentRoleView();
    }

    authenticate(credentials?, success?, error?) {
        this.credentials = credentials !== undefined ? credentials : this.credentials;

        this.http.get('/user').subscribe(res => {
            this.authenticated = !!res && !!res['name'];
            if (this.authenticated) {
                if (!this.user.id) {
                    this.userHelperService.getUserByEmail(res['principal']['username'], user => {
                        this.user = user;
                        this.getCurrentRoleView();
                        this.authenticatedService.setAuthenticated(this.authenticated);
                        this.saveSessionInfo();
                    });
                } else {
                    this.authenticatedService.setAuthenticated(this.authenticated);
                }

            } else {
                this.discardSession();
            }
            return !!success && success(this.authenticated);
        }, err => {
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


    public getAuthorizationHeader() {
        if (!this.credentials) {
            return 'Basic ';
        }
        return 'Basic ' + btoa(this.credentials.username + ':' + this.credentials.password);
    }

    public discardSession() {
        this.authenticated = false;
        this.credentials = undefined;
        this.user = new User();
        this.saveSessionInfo();
        this.authenticatedService.setAuthenticated(this.authenticated);
    }

    logout(callback) {
        this.http.get('/logout').subscribe(_ => {
                this.discardSession();
            },
            undefined, () => {
                return !!callback && callback();
            });
    }

}
