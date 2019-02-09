import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserHelperService, UserService} from "../shared/services";
import {Role, User} from "../shared/model";
import {NotificationService} from "./notification.service";
import {ChangeViewService} from "./change-view.service";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

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


    constructor(private http: HttpClient,
                private userService: UserService,
                private userHelperService: UserHelperService,
                private messageService: NotificationService,
                private changeViewService: ChangeViewService) {
        this.user = new User();
        this.getRolesAndCurrentRoleView();
    }

    changeView(role) {
        this.current_role_view = role;
        this.changeViewService.sendView(this.current_role_view)
    }

    authenticate(credentials, success?, error?) {
        this.credentials = credentials !== undefined ? credentials: this.credentials;

        this.http.get('/user').subscribe(res => {
            this.authenticated = !!res && !!res['name'];
            if (this.authenticated) {
                this.user = new User();
                this.getRoles(res);
                this.getEmail(res);
                this.getRolesAndCurrentRoleView();
            }
            return !!success && success(this.authenticated);
        }, err => {
            return !!error && error(err)
        });
    }

    initializeWebSocketConnection() {
        let ws = new SockJS(this.SOCKET_PATH);
        this.stompClient = Stomp.over(ws);
        let that = this;
        this.stompClient.connect({}, function() {
            // that.stompClient.subscribe("/chat", (message) => {
            //     console.log(message);
            // });
            // that.stompClient.send("/app/send/message" , {}, "Hello world");
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
    }

    logout(callback) {
        this.http.get('/logout')
            .subscribe(_ => {
                    this.discardSession()
                },
                undefined,
                () => {
                    this.authenticated = false;
                    return !!callback && callback()
                });
    }

}
