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

    getCourses(startTime: string, endTime: string): Observable<any> {
        return this.http.get(`/bundles/courses?startTime=${startTime}&endTime=${endTime}`);
    }

    findById(id: number) {
        return this.http.get(`/bundles/${id}`);
    }

    @to_promise
    post(params: any): any {
        return this.http.post(`/bundles`, params);
    }

    @to_promise
    delete(id: number): any {
        return this.http.delete(`/bundles/${id}`);
    }
}
