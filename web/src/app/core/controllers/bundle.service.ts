import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable()
export class BundleService {

    constructor(private http: HttpClient) {
    }

    getCourses(startTime: string, endTime: string): Observable<any> {
        return this.http.get(`/bundles/courses?startTime=${startTime}&endTime=${endTime}`);
    }
}
