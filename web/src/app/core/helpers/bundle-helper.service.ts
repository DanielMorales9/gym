import {Injectable} from '@angular/core';
import {Bundle} from '../../shared/model';
import {Observable} from 'rxjs';
import {HelperService} from './helper.service';
import {BundleService} from '../controllers';

@Injectable()
export class BundleHelperService extends HelperService<Bundle> {

    constructor(private service: BundleService) {
        super();
    }

    get(page: number, size: number): Observable<Object> {
        return this.service.get(page, size);
    }

    search(query: any, page: number, size: number): Observable<Object> {
        return this.service.search(query, page, size);
    }

    preProcessResources(resources: Bundle[]): Bundle[] {
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

    extract(res: Object): Bundle[] {
        return res['content'];
    }
}
