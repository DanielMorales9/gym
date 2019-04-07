import {Injectable} from '@angular/core';
import {Bundle} from '../model';
import {Observable} from 'rxjs';
import {HelperService} from './helper.service';
import {BundlesService} from './bundles.service';

@Injectable()
export class BundleHelperService extends HelperService<Bundle> {

    constructor(private service: BundlesService) {
        super()
    }

    get(page: number, size: number) : Observable<Object> {
        return this.service.get(page, size)
    }

    search(query: any, page: number, size: number): Observable<Object> {
        return this.service.search(query, page, size);
    }

    preProcessResources(resources: Bundle[]): Bundle[] {
        resources = this.extract(resources);
        return resources
    }

    getOrSearch(query: any, page: number, size: number): Observable<Object> {
        let observable;
        if (query === undefined || query == '')
            observable = this.get(page, size);
        else
            observable = this.search(query, page, size);
        return observable;
    }

    extract(res: Object) : Bundle[] {
        let bundles;
        if (res['_embedded']) {
            bundles = res['_embedded']['aTrainingBundleSpecifications'];
        } else {
            bundles = res['content'];
        }
        return bundles
    }
}
