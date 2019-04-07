import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ABundleService} from './abundle.service';

@Injectable()
export class BundlesNotDisabledService extends ABundleService {

    constructor(private http: HttpClient) {
        super();
    }

    search(query: string, page: number, size) : Observable<Object> {
        return this.http.get(`/bundleSpecs/searchNotDisabled?query=${query}&page=${page}&size=${size}&sort=createdAt,desc&sort=name,asc`);
    }

    get(page: number, size: number) : Observable<Object> {
        return this.http.get(`/bundleSpecs/getNotDisabled?page=${page}&size=${size}&sort=createdAt,desc&sort=name,asc`);
    }
}
