import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserHelperService, UserService} from "../shared/services";
import {Role, User} from "../shared/model";
import {NotificationService} from "./notification.service";
import {ChangeViewService} from "./change-view.service";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {AuthenticatedService} from "./authenticated.service";

@Injectable({
    providedIn: 'root'
})
export class AppService {

    ROLE2INDEX = {
        'ADMIN' : 1,
        'TRAINER' : 2,
        'CUSTOMER' : 3
    };
    private SOCKET_PATH = '/socket';


    current_role_view: number;
    credentials: any;
    authenticated = false;
    user : any;

    private stompClient : Stomp;


    authenticate(credentials?, success?, error?) {
        this.credentials = credentials !== undefined ? credentials: this.credentials;

        this.http.get('/user').subscribe(res => {
            this.authenticated = !!res && !!res['name'];
            if (this.authenticated) {
                this.user = new User();
                this.getEmail(res);
                this.userHelperService.getUserByEmail(this.user.email, user => {
                    this.user.id = user['id'];
                });
                this.getRoles(res);
                this.getRolesAndCurrentRoleView();
            }
            return !!success && success(this.authenticated);
        }, err => {
            return !!error && error(err)
        }, () => {
            this.authenticatedService.setAuthenticated(this.authenticated);
        });
    }

    constructor(private http: HttpClient,
                private userService: UserService,
                private userHelperService: UserHelperService,
                private messageService: NotificationService,
                private authenticatedService: AuthenticatedService,
                private changeViewService: ChangeViewService) {
        this.user = new User();
        this.getRolesAndCurrentRoleView();
    }

    changeView(role) {
        this.current_role_view = role;
        this.changeViewService.sendView(this.current_role_view)
    }

    initializeWebSocketConnection() {
        let ws = new SockJS(this.SOCKET_PATH);
        this.stompClient = Stomp.over(ws);
        let that = this;
        this.stompClient.connect({}, function() {
            that.stompClient.subscribe("/notifications", (message) => {
                let notification = JSON.parse(message.body);
                that.messageService.sendMessage({
                    text: notification.message,
                    class: "alert-info"
                })
            });
        });
    }


    private getRolesAndCurrentRoleView() {
        this.current_role_view = this.userHelperService.getHighestRole(this.user);
    }

    private getEmail(response) {
        this.user['email'] = response['principal']['username'];
    }

    private getRoles(response) {
        this.user.roles = response['authorities'].map((item, _) => {
            let role = new Role(1, "ADMIN");
            role.name = item['authority'];
            role.id = this.ROLE2INDEX[item['authority']];
            return role;
        });
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
