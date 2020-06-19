import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable()
export class SessionService {

    constructor(private http: HttpClient) {
    }

    get(page: number, size: number, params?: any): Observable<Object> {
        console.log(params);

        if (!params) {
            params = {};
        }
        params['page'] = page;
        params['size'] = size;
        return this.http.get(`/trainingSessions`, {params: params});
    }

    findSessionById(id: any): Observable<any> {
        return this.http.get(`/trainingSessions/${id}`);
    }

}
