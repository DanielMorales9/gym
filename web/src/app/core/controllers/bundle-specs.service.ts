import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BundleSpecification} from '../../shared/model';
import {DataSourceService} from './data-source.service';
import {to_promise} from '../functions/decorators';

@Injectable()
export class BundleSpecsService extends DataSourceService {

    constructor(private http: HttpClient) {
        super();
    }

    patchBundleSpecs(bundle: BundleSpecification): Observable<Object> {
        return this.http.patch(`/bundleSpecs/${bundle.id}`, bundle);
    }

    post(bundle: BundleSpecification): Observable<Object> {
        return this.http.post('/bundleSpecs', bundle);
    }

    get(page: number, size: number): Observable<Object> {
        return this.http.get(`/bundleSpecs?page=${page}&size=${size}&sort=name`);
    }

    search(query: any, page: number, size: number): Observable<Object> {
        query['page'] = page;
        query['size'] = size;
        query['sort'] = ['createdAt,desc', 'name,asc'];
        return this.http.get('/bundleSpecs/search', {params: query});
    }

    getSessions(endpoint): Observable<Object> {
        return this.http.get(endpoint);
    }

    deleteBundleSpecs(id: number): Observable<any> {
        return this.http.delete(`/bundleSpecs/${id}`);
    }

    findBundleSpecById(id: number): Observable<any> {
        return this.http.get(`/bundleSpecs/${id}`);
    }

    createOption(id: any, obj: any): Observable<any> {
        return this.http.post(`/bundleSpecs/${id}/options`, obj);
    }

    listBundleSpecs(param: any): Observable<any> {
        return this.http.get(`/bundleSpecs/list`, {params: param});
    }

    deleteOption(specId: number, optionId: number): Observable<any> {
        return this.http.delete(`/bundleSpecs/${specId}/options/${optionId}`);
    }
}
