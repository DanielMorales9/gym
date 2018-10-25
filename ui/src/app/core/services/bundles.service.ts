import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {Bundle} from "../../core/model/bundle.class";
import {Observable} from "rxjs";

@Injectable()
export class BundlesService {

    constructor(private http: HttpClient) {}

    put(bundle: Bundle) : Observable<Object> {
        return this.http.put(`/bundleSpecs/${bundle.id}`, bundle);
    }

    post(bundle: Bundle) : Observable<Object> {
        return this.http.post("/bundleSpecs", bundle);
    }

    get(page: number, size: number) : Observable<Object> {
        return this.http.get(`/bundleSpecs?page=${page}&size=${size}&sort=name`);
    }

    search(query:string, page: number, size: number) : Observable<Object> {
        return this.http.get(`/bundleSpecs/search?query=${query}&page=${page}&size=${size}&sort=createdAt,desc&sort=name,asc`);
    }

    searchNotDisabled(query: string, page: number, size) : Observable<Object> {
        return this.http.get(`/bundleSpecs/searchNotDisabled?query=${query}&page=${page}&size=${size}&sort=createdAt,desc&sort=name,asc`);
    }

    getNotDisabled(page: number, size: number) : Observable<Object> {
        return this.http.get(`/bundleSpecs/getNotDisabled?page=${page}&size=${size}&sort=createdAt,desc&sort=name,asc`);
    }

    getSessions(endpoint) : Observable<Object> {
        return this.http.get(endpoint);
    }

}