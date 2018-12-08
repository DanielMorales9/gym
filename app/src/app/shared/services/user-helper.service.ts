import {Injectable} from '@angular/core'
import {UserService} from "./users.service";
import {Role, User} from "../model";

@Injectable()
export class UserHelperService {

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

    constructor(private userService: UserService) {}

    getRoles(user: User, callback?) : void {
        if (!!user.roles) {
            if (!!user.roles['_embedded']) {
                user.roles = user.roles['_embedded']['roleResources'].map(val => {
                    return new Role(this.ROLE2INDEX[val.name], val.name);
                });
            }
            else {
                this._getRoles(user)
            }
        }
        else {
            this._getRoles(user)
        }
        return !!callback && callback()
    }

    private _getRoles(user): void {
        this.userService.getRoles(user.id).subscribe(value => {
            user.roles = value['_embedded']['roles'].map(val => {
                return new Role(this.ROLE2INDEX[val.name], val.name);
            });
        });
    }

    getHighestRole(user) {
        if (!user.roles)
            return 3;
        return user.roles.map(role => role.id).reduce((a, b) => Math.min(a, b), 3);
    }

    static getUserCreatedAt(user) {
        let date = new Date(user.createdAt);
        return date.toLocaleDateString();
    }

    getUser(id: number, callback: (user: User) => void) {
        this.userService.findById(id).subscribe(callback)
    }


    getUserByEmail(email: string, callback: (user) => void) {
        this.userService.findByEmail(email).subscribe(callback)
    }

    static wrapUsers(res: any) {
        let users = [];
        if (res['_embedded']['admins']) {
            users = users.concat(res['_embedded']['admins'])
        }
        if (res['_embedded']['customers']) {
            users = users.concat(res['_embedded']['customers'])
        }
        if (res['_embedded']['trainers']) {
            users = users.concat(res['_embedded']['trainers'])
        }
        return users;
    }
}