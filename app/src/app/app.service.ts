import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ChangeViewService, NotificationService, UserService} from "./shared/services";
import {Role, User} from "./shared/model";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AppService {

    ROLE2INDEX = {
        'ADMIN' : 1,
        'TRAINER' : 2,
        'CUSTOMER' : 3
    };

    INDEX2ROLE = {
        1 :'ADMIN',
        2: 'TRAINER',
        3: 'CUSTOMER'
    };

    current_role_view: number;
    authenticated = false;
    user : User;
    credentials: any;

    constructor(private http: HttpClient,
                private userService: UserService,
                private messageService: NotificationService,
                private changeViewService: ChangeViewService) {
        this.user = new User();
        this.getRolesAndCurrentRoleView();
    }

    changeView(role) {
        this.current_role_view = role;
        this.changeViewService.sendView(this.current_role_view)
    }

    authenticate(credentials, callback, errorCallback) {
        this.credentials = credentials !== undefined ? credentials: this.credentials;

        this.http.get('/user').subscribe(res => {
            this.authenticated = !!res && !!res['name'];
            if (this.authenticated) {
                this.user = new User();
                this.getRoles(res);
                this.getEmail(res);
                this.getRolesAndCurrentRoleView();
            }
            return callback && callback(this.authenticated);
        }, error => {
            return errorCallback && errorCallback(error)
        });
    }

    private getRolesAndCurrentRoleView() {
        this.current_role_view = this.user.roles.map( role => role.id)
            .reduce((a, b) => Math.min(a, b), 3);
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

    getFullUser() {
        return this.userService.findByEmail(this.user.email);
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

    getUserFromVerificationToken(token: any) {
        return this.http.get("/authentication/verification",{ params: {token: token}});
    }

    resendToken(token: string) {
        return this.http.get("/authentication/resendToken", {params: {token: token}})
    }

    changePassword(user: User, userType: string) {
        return this.http.post(`/authentication/${userType}/changePassword`, user);
    }

    verifyPassword(credentials, role) {
        return this.http.post( `/authentication/${role}/verifyPassword`, credentials);
    }

    findByEmail(email: string) {
        return this.http.get(`/authentication/findByEmail?email=${email}`)
    }

    logout(callback) {
        this.http.get('/logout').subscribe(
            _ => {
                this.discardSession()
            },
            undefined,
            () => {
                this.authenticated = false;
                return callback && callback()
            });
    }

}
