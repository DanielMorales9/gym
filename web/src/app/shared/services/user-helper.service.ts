import {Injectable} from '@angular/core';
import {UserService} from './users.service';
import {Role, User} from '../model';
import {HelperService} from './helper.service';
import {Observable} from 'rxjs';

@Injectable()
export class UserHelperService extends HelperService<User> {

    constructor(private service: UserService) {
        super();
    }

    ROLE2INDEX = {
        'ADMIN' : 1,
        'TRAINER' : 2,
        'CUSTOMER' : 3
    };

    TYPE2INDEX = {
        'A': 1,
        'T': 2,
        'C': 3
    };

    static getUserCreatedAt(user) {
        const date = new Date(user.createdAt);
        return date.toLocaleDateString();
    }

    getRoles(user: User, callback?): void {
        if (!!user.roles) {
            if (!!user.roles['_embedded']) {
                user.roles = this.unwrapRoles(user.roles);
            } else {
                this._getRoles(user);
            }
        } else {
            this._getRoles(user);
        }
        return !!callback && callback();
    }

    private _getRoles(user): void {
        this.service.getRoles(user.id).subscribe(value => {
            user.roles = value['_embedded']['roles'].map(val => {
                return new Role(this.ROLE2INDEX[val.name], val.name);
            });
        });
    }

    unwrapRoles(roles: any) {
        return roles['_embedded']['roleResources'].map(val => {
            return new Role(this.ROLE2INDEX[val.name], val.name);
        });
    }

    getUser(id: number, callback: (user: User) => void) {
        this.service.findById(id).subscribe(callback);
    }


    getUserByEmail(email: string, callback: (user) => void) {
        this.service.findByEmail(email).subscribe(callback);
    }

    getHighestRole(user) {
        if (user.type) {
            return this.TYPE2INDEX[user.type];
        } else {
            return 3;
        }
    }

    get(page: number, size: number): Observable<Object> {
        return this.service.get(page, size);
    }

    search(query: any, page: number, size: number): Observable<Object> {
        if (query.type) {
            if (query.query) {
                return this.service.searchCustomerByLastName(query.query, page, size);
            } else {
                return this.service.getCustomers(page, size);
            }

        } else {
            return this.service.search(query.query, page, size);
        }
    }

    preProcessResources(resources: User[]): User[] {
        resources = this.extract(resources);
        return resources;
    }

    getOrSearch(query: any, page: number, size: number): Observable<Object> {
        let observable;
        if (query === undefined || Object.keys(query).length === 0) {
            observable = this.get(page, size);
        } else {
            observable = this.search(query, page, size);
        }
        return observable;
    }

    extract(res: Object): User[] {
        let users = [];
        if (res['_embedded']) {
            if (res['_embedded']['admins']) {
                users = users.concat(res['_embedded']['admins']);
            }
            if (res['_embedded']['customers']) {
                users = users.concat(res['_embedded']['customers']);
            }
            if (res['_embedded']['trainers']) {
                users = users.concat(res['_embedded']['trainers']);
            }
        } else {
            users = res['content'];
        }
        return users;
    }

}