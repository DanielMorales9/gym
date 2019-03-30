import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserHelperService, UserService} from "../shared/services";
import {User} from "../shared/model";
import {NotificationService} from "./notification.service";
import {ChangeViewService} from "./change-view.service";
import {AuthenticatedService} from "./authenticated.service";

@Injectable({
    providedIn: 'root'
})
export class AppService {

    current_role_view: number;
    credentials: any;
    authenticated = false;
    user: User;

    // private SOCKET_PATH = '/socket';
    // private stompClient : Stomp;


    constructor(private http: HttpClient,
                private userService: UserService,
                private userHelperService: UserHelperService,
                private messageService: NotificationService,
                private authenticatedService: AuthenticatedService,
                private changeViewService: ChangeViewService) {
        this.user = new User();
        this.getCurrentRoleView();
    }

    authenticate(credentials?, success?, error?) {
        this.credentials = credentials !== undefined ? credentials: this.credentials;

        this.http.get('/user').subscribe(res => {

            this.authenticated = !!res && !!res['name'];
            if (this.authenticated) {
                let email = res['principal']['username'];

                this.userHelperService.getUserByEmail(email, user => {
                    this.user = user;
                    this.getCurrentRoleView();
                    this.userHelperService.getRoles(this.user);
                    this.authenticatedService.setAuthenticated(this.authenticated);
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

    public getAuthorizationHeader() {
        if (!this.credentials) {
            return 'Basic ';
        }
        return 'Basic ' + btoa(this.credentials.username + ':' + this.credentials.password);
    }

    public discardSession() {
        this.credentials = {};
        this.user = new User();
        this.authenticatedService.setAuthenticated(false);
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
