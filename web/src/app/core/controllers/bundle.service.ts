import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


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
}
