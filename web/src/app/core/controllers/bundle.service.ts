import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Bundle, CourseBundle, PersonalBundle} from "../../shared/model";


@Injectable()
export class BundleService {

    constructor(private http: HttpClient) {
    }

    get(page: number, size: number): Observable<Object> {
        return this.http.get(`/bundles?page=${page}&size=${size}&sort=createdAt,desc`);
    }

    search(query: any, page: number, size: number): Observable<Object> {
        query['page'] = page;
        query['size'] = size;
        query['sort'] = 'createdAt,desc';
        return this.http.get(`/bundles/search`, {params: query});
    }

    findById(id: number): Observable<any> {
        return this.http.get(`/bundles/${id}`);
    }

    deleteBundle(id: number): Observable<any> {
        return this.http.delete(`/bundles/${id}`);
    }

    patchBundle(bundle: Bundle): Observable<any> {
        console.log(
            bundle
        )
        bundle = Object.assign({}, bundle);

        if (bundle.sessions) {
            delete bundle.sessions
        }

        if (bundle.customer) {
            delete bundle.customer
        }

        if (bundle.option) {
            delete bundle.option
        }

        if (bundle.bundleSpec) {
            delete bundle.bundleSpec
        }
        console.log(
            bundle
        )
        return this.http.patch(`/bundles/${bundle.id}`, bundle);
    }

}
