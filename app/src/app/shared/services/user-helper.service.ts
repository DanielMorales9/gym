
import { Injectable } from '@angular/core'
import {UserService} from "./users.service";
import {Role, User} from "../model";
import {Observable} from "rxjs";

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


    getRoles(user: User, callback) : void {
        if (!!user.roles) {
            if (!!user.roles['_embedded']) {
                let roles = user.roles['_embedded']['roleResources'].map(val => {
                    return new Role(this.ROLE2INDEX[val.name], val.name);
                });
                return callback(roles);
            }
            else {
                this._getRoles(user, callback)
            }
        }
        else {
            this._getRoles(user, callback)
        }
    }

    private _getRoles(user, callback): void {
        this.userService.getRoles(user.id).subscribe(value => {
            let roles = value['_embedded']['roles'].map(val => {
                return new Role(this.ROLE2INDEX[val.name], val.name);
            });
            return callback(roles);
        });
    }

    getHighestRole(user) {
        return user.roles.map(role => role.id).reduce((a, b) => Math.min(a, b), 3);
    }

    getUserCreatedAt(user) {
        let date = new Date(user.createdAt);
        return date.toLocaleDateString();
    }

    getUser(id: number, callback: (user: User) => void) {
        this.userService.findById(id).subscribe(callback)
    }


    getUserByEmail(email: string, callback: (user) => void) {
        this.userService.findByEmail(email).subscribe(callback)
    }
}