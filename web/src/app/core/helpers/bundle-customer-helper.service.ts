import {Injectable} from '@angular/core';
import {Bundle} from '../../shared/model';
import {Observable} from 'rxjs';
import {HelperService} from './helper.service';
import {UserService} from '../controllers';
import {map} from "rxjs/operators";
import {mapToBundle} from "../../shared/mappers/bundle.mappers";

@Injectable()
export class BundleCustomerHelperService extends HelperService<Bundle> {

    constructor(private service: UserService) {
        super();
    }

    get(page: number, size: number): Observable<Object> {
        throw new Error('Qualcosa è andato storto');
    }

    search(query: any, page: number, size: number): Observable<Object> {
        if (!!query.date) {
            query = Object.assign({}, query);
            const date = new Date(query.date);
            query.date = date.getUTCDate() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCFullYear();
        }
        return this.service.getCustomerBundles(query, page, size);
    }

    preProcessResources(resources: Object): Bundle[] {
        return this.extract(resources).map(mapToBundle);
    }

    getOrSearch(query: any, page: number, size: number): Observable<Object> {
        return this.search(query, page, size);
    }

    extract(res: Object): Bundle[] {
        return res['content'];
    }
}
