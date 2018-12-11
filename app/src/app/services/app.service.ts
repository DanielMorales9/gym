import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserHelperService, UserService} from "../shared/services";
import {Role, User} from "../shared/model";
import {NotificationService} from "./notification.service";
import {ChangeViewService} from "./change-view.service";

@Injectable({
    providedIn: 'root'
})
export class AppService {

    ROLE2INDEX = {
        'ADMIN' : 1,
        'TRAINER' : 2,
        'CUSTOMER' : 3
    };

    current_role_view: number;
    authenticated = false;
    user : User;
    credentials: any;

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
