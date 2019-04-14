import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserHelperService, UserService} from '../shared/services';
import {User} from '../shared/model';
import {ChangeViewService} from './change-view.service';
import {AuthenticatedService} from './authenticated.service';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    current_role_view: number;
    credentials: { username: string, password: string };
    authenticated;
    user: User;

    // private SOCKET_PATH = '/socket';
    // private stompClient : Stomp;


    constructor(private http: HttpClient,
                private userService: UserService,
                private userHelperService: UserHelperService,
                private authenticatedService: AuthenticatedService,
                private changeViewService: ChangeViewService) {
        this.loadSessionInfo();
        // this.user = new User();
        this.getCurrentRoleView();
    }

    authenticate(credentials?, success?, error?) {
        this.credentials = credentials !== undefined ? credentials: this.credentials;

        this.http.get('/user').subscribe(res => {

            this.authenticated = !!res && !!res['name'];
            if (this.authenticated) {
                const email = res['principal']['username'];

                this.userHelperService.getUserByEmail(email, user => {
                    this.user = user;
                    this.getCurrentRoleView();
                    this.userHelperService.getRoles(this.user);
                    this.authenticatedService.setAuthenticated(this.authenticated);
                    this.saveSessionInfo();
                });
            }
            return !!success && success(this.authenticated);
        }, err => {
            return !!error && error(err)
        });
    }

    changeView(role) {
        this.current_role_view = role;
        this.changeViewService.sendView(this.current_role_view)
    }

    // initializeWebSocketConnection() {
    //     let ws = new SockJS(this.SOCKET_PATH);
    //     this.stompClient = Stomp.over(ws);
    //     let that = this;
    //     this.stompClient.connect({}, function() {
    //         that.stompClient.subscribe("/notifications", (message) => {
    //             let notification = JSON.parse(message.body);
    //             that.messageService.sendMessage({
    //                 text: notification.message,
    //                 class: "alert-info"
    //             })
    //         });
    //     });
    // }


    private getCurrentRoleView() {
        this.current_role_view = this.userHelperService.getHighestRole(this.user);
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
                this.discardSession()
            },
            undefined, () => {
                return !!callback && callback()
            });
    }

}
