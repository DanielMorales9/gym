import {Injectable} from '@angular/core';
import {Bundle} from '../../shared/model';
import {Observable} from 'rxjs';
import {HelperService} from './helper.service';
import {BundleService} from '../controllers';
import {map} from 'rxjs/operators';
import {mapToBundle} from '../../shared/mappers';

@Injectable()
export class BundleHelperService extends HelperService<Bundle> {

    constructor(private service: BundleService) {
        super();
    }

    get(page: number, size: number): Observable<Object> {
        return this.service.get(page, size);
    }

    search(query: any, page: number, size: number): Observable<Object> {
        if (!!query.date) {
            query = Object.assign({}, query);
            const date = new Date(query.date);
            query.date = date.getUTCDate() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCFullYear();
        }
        return this.service.search(query, page, size);
    }

    preProcessResources(resources: Object): Bundle[] {
        return this.extract(resources).map(mapToBundle);
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
