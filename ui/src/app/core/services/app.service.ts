import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ChangeViewService} from "./change-view.service";
import {MessageService} from "./message.service";
import {UserService} from "./users.service";

@Injectable()
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

    current_role_view: any;
    authenticated = false;
    user : any;
    roles = [];
    private credentials: any;

    constructor(private http: HttpClient,
                private userService: UserService,
                private messageService: MessageService,
                private changeViewService: ChangeViewService) {
        this.user = this.getUser();
        if (this.user) {
            this.getRolesAndCurrentRoleView();
        }
    }

    private getRolesAndCurrentRoleView() {
        this.roles = this.user.roles;
        this.current_role_view = this.roles.map((item, _) => {
            return item['role_index']
        }).reduce((a, b) => {
                return (a > b) ? b : a
            });
    }

    changeView(role) {
        this.current_role_view = role;
        this.changeViewService.sendView(this.current_role_view)
    }

    authenticate(credentials, callback, errorCallback) {
        let user = {};
        this.credentials = credentials !== undefined ? credentials: this.credentials;
        if (this.credentials) {
            this.saveCredentials()
        }
        else {
            this.credentials = this.getCredentials()
        }
        this.http.get('/user').subscribe(response => {
            this.authenticated = !!response['name'];
            if (this.authenticated) {
                user['roles'] = response['authorities'].map((item, _) => {
                    let role = item['authority'];
                    return {'role_name': role, 'role_index': this.ROLE2INDEX[role]}
                });
                this.current_role_view = user['roles'].map((item, _) => {return item['role_index']})
                    .reduce((a, b) => {
                        return (a > b) ? b : a
                    });
                user['email'] = response['principal']['username'];
                this.user = user;
                this.saveUser();
                this.getRolesAndCurrentRoleView();
            }
            return callback && callback(this.authenticated);
        }, error => {
            return errorCallback && errorCallback(error)
        });
    }


    private getCredentials() {
        return JSON.parse(window.localStorage.getItem('credentials'));
    }
    private saveCredentials() {
        window.localStorage.setItem('credentials', JSON.stringify(this.credentials));
    }

    private saveUser() {
        window.localStorage.setItem('user', JSON.stringify(this.user));
    }

    private saveFullUser(user: any) {
        window.localStorage.setItem('full_user', JSON.stringify(user));
    }

    private getUser() {
        return JSON.parse(window.localStorage.getItem('user'));
    }

    getFullUser(success, error) {
        let user = JSON.parse(window.localStorage.getItem('full_user'));
        user = (user) ? user : this.getUser();
        if (!user['id']) {
            this.userService.findByEmail(user.email).subscribe(
                res => {
                this.saveFullUser(res);
                success(res);
            }, error)
        }
        else {
            success(user)
        }
    }

    _systemError() {
        return err => {
            let message ={
                text: err.error.message,
                class: "alert-danger"
            };
            this.messageService.sendMessage(message);
        }
    }

    public getAuthorizationHeader() {
        if (!this.credentials){
            return 'Basic ';
        }
        return 'Basic ' + btoa(this.credentials.username + ':' + this.credentials.password);
    }

    public discardUsers() {
        this.credentials = {};
        this.user = {};
        window.localStorage.removeItem('credentials');
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('full_user');
    }

    getUserFromVerificationToken(token: any, successCallback, errorCallback) {
        this.http.get("/auth/verification",{ params: {token: token}}).subscribe(response => {
            return successCallback && successCallback(response)
        }, error => {
            return errorCallback && errorCallback(error)
        })
    }

    resendToken(token: any, successCallback, errorCallback) {
        this.http.get("/auth/resendToken",
            {params: {token: token}}).subscribe(response => {
            return successCallback && successCallback(response)
        }, error => {
            return errorCallback && errorCallback(error)
        })
    }

    changePassword(cred, role, successCallback, errorCallback) {
        let endPoint = "/auth/"+role+"/changePassword";
        this.http.post(endPoint, cred).subscribe(response => {
            return successCallback && successCallback(response);
        }, error => {
            return errorCallback && errorCallback(error);
        })
    }

    logout() {
        this.discardUsers()
    }
}
