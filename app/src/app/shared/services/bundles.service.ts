import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {Observable} from "rxjs";
import {Bundle} from "../model";
import {ABundleService} from './abundle.service';

@Injectable()
export class BundlesService extends ABundleService {

    constructor(private http: HttpClient) {
        super();
    }

    put(bundle: Bundle): Observable<Object> {
        return this.http.put(`/bundleSpecs/${bundle.id}`, bundle);
    }

    post(bundle: Bundle): Observable<Object> {
        return this.http.post('/bundleSpecs', bundle);
    }

    get(page: number, size: number): Observable<Object> {
        return this.http.get(`/bundleSpecs?page=${page}&size=${size}&sort=name`);
    }

    search(query: string, page: number, size: number): Observable<Object> {
        return this.http.get(`/bundleSpecs/search?query=${query}&page=${page}&size=${size}&sort=createdAt,desc&sort=name,asc`);
    }

    getSessions(endpoint) : Observable<Object> {
        return this.http.get(endpoint);
    }

    delete(id: number) {
        return this.http.delete(`/bundleSpecs/${id}`);
    }

    findById(id: number) {
        return this.http.get(`/bundleSpecs/${id}`);
    }
}
