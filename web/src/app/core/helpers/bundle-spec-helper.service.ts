import {Injectable} from '@angular/core';
import {BundleSpecification} from '../../shared/model';
import {Observable} from 'rxjs';
import {HelperService} from './helper.service';
import {BundleSpecsService} from '../controllers';
import {mapToBundleSpec} from "../../shared/mappers/bundleSpec.mappers";
import {map} from "rxjs/operators";

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
        return resources;
    }

    toBundleSpecs(obj: Object): BundleSpecification[] {
        return obj['content'].map(mapToBundleSpec)
    }

    getOrSearch(query: any, page: number, size: number): Observable<Object> {
        let observable;
        if (query === undefined) {
            observable = this.get(page, size);
        } else {
            observable = this.search(query, page, size);
        }
        return observable.pipe(map(this.toBundleSpecs));
    }

    extract(res: Object): BundleSpecification[] {
        return res['content'];
    }
}
