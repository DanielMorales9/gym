import {Injectable} from '@angular/core';
import {BundleSpecification} from '../../shared/model';
import {Observable} from 'rxjs';
import {HelperService} from './helper.service';
import {BundleSpecsService} from '../controllers';

@Injectable()
export class BundleSpecHelperService extends HelperService<BundleSpecification> {

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
        return this.extract(resources);
    }

    getOrSearch(query: any, page: number, size: number): Observable<Object> {
        let observable;
        if (query === undefined) {
            observable = this.get(page, size);
        } else {
            observable = this.search(query, page, size);
        }
        return observable;
    }

    extract(res: Object): BundleSpecification[] {
        return res['content'];
    }
}
