import {Injectable} from '@angular/core';
import {BundleSpecification} from '../../shared/model';
import {Observable} from 'rxjs';
import {HelperService} from './helper.service';
import {BundleSpecsService} from '../controllers/bundle-specs.service';

@Injectable()
export class BundleHelperService extends HelperService<BundleSpecification> {

    constructor(private service: BundleSpecsService) {
        super();
    }

    get(page: number, size: number): Observable<Object> {
        return this.service.get(page, size);
    }

    search(query: any, page: number, size: number): Observable<Object> {
        return this.service.search(query, page, size);
    }

    preProcessResources(resources: BundleSpecification[]): BundleSpecification[] {
        resources = this.extract(resources);
        return resources;
    }

    getOrSearch(query: any, page: number, size: number): Observable<Object> {
        let observable;
        if (query === undefined || query === '') {
            observable = this.get(page, size);
        } else {
            observable = this.search(query, page, size);
        }
        return observable;
    }

    extract(res: Object): BundleSpecification[] {
        let bundles;
        if (res['_embedded']) {
            bundles = res['_embedded']['aTrainingBundleSpecifications'];
        } else {
            bundles = res['content'];
        }
        return bundles;
    }
}
