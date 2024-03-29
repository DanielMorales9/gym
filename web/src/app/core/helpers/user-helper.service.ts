import {Injectable} from '@angular/core';
import {UserService} from '../controllers';
import {User} from '../../shared/model';
import {HelperService} from './helper.service';
import {Observable} from 'rxjs';

@Injectable()
export class UserHelperService extends HelperService<User> {

    constructor(private service: UserService) {
        super();
    }

    get(page: number, size: number): Observable<Object> {
        return this.service.get(page, size);
    }

    search(query: any, page: number, size: number): Observable<Object> {
        if (!!query.name) {
            return this.service.search(query.name, page, size);
        }
        else {
            return this.service.get(page, size);
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
