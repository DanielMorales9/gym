import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DataSourceService} from './data-source.service';

@Injectable()
export class BundlesNotDisabledService extends DataSourceService {

    constructor(private http: HttpClient) {
        super();
    }

    search(query: any, page: number, size): Observable<Object> {
        query['page'] = page;
        query['size'] = size;
        query['sort'] = ['createdAt,desc', 'name,asc'];
        return this.http.get('/bundleSpecs/search', {params: query});
    }

    get(page: number, size: number): Observable<Object> {
        return this.http.get(`/bundleSpecs/getNotDisabled?page=${page}&size=${size}&sort=createdAt,desc&sort=name,asc`);
    }
}
