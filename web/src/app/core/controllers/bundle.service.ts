import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {to_promise} from '../functions/decorators';


@Injectable()
export class BundleService {

    constructor(private http: HttpClient) {
    }

    get(page: number, size: number): Observable<Object> {
        return this.http.get(`/bundles?page=${page}&size=${size}&sort=name`);
    }

    search(query: any, page: number, size: number): Observable<Object> {
        query['page'] = page;
        query['size'] = size;
        return this.http.get(`/bundles/search`, {params: query});
    }

    findById(id: number): Observable<any> {
        return this.http.get(`/bundles/${id}`);
    }

    deleteBundle(id: number): Observable<any> {
        return this.http.delete(`/bundles/${id}`);
    }

    patchBundle(bundle: any): Observable<any> {
        return this.http.patch(`/bundles/${bundle.id}`, bundle);
    }

}
