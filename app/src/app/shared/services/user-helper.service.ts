
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


    getRoles(id: number, callback) : void {
        this.userService.getRoles(id).subscribe(value => {
            let roles = value['_embedded']['roles'].map(val => {
                return new Role(this.ROLE2INDEX[val.name], val.name);
            });
            return callback(roles);
        });
    }

    getUserCreatedAt(user) {
        let date = new Date(user.createdAt);
        return date.toLocaleDateString();
    }

    getUser(id: number, callback: (user: User) => void) {
        this.userService.findById(id).subscribe(callback)
    }
}