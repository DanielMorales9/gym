import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HelperService} from './helper.service';
import {SessionService} from '../controllers/session.service';
import {Session} from '../../shared/model/session.class';

@Injectable()
export class SessionHelperService extends HelperService<Session> {

    constructor(private service: SessionService) {
        super();
    }

    get(page: number, size: number, params?: any): Observable<Object> {
        return this.service.get(page, size, params);
    }

    search(query: any, page: number, size: number): Observable<Object> {
        if (!!query.date) {
            query = Object.assign({}, query);
            const date = new Date(query.date);
            query.date = date.getUTCDate() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCFullYear();
        }
        return this.service.get(page, size, query);
    }

    preProcessResources(resources: Session[]): Session[] {
        return this.extract(resources);
    }

    getOrSearch(query: any, page: number, size: number): Observable<Object> {
        let observable;
        if (query === undefined || query === '') {
            observable = this.get(page, size);
        } else {
            observable = this.search(query, page, size);
        }
        return observable;
    }

    extract(res: Object): Session[] {
        return res['content'];
    }
}
