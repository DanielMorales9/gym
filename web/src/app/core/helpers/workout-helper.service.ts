import {Injectable} from '@angular/core';
import {Bundle, Workout} from '../../shared/model';
import {Observable} from 'rxjs';
import {HelperService} from './helper.service';
import {BundleService, WorkoutService} from '../controllers';

@Injectable()
export class WorkoutHelperService extends HelperService<Workout> {

    constructor(private service: WorkoutService) {
        super();
    }

    get(page: number, size: number): Observable<Object> {
        return this.service.get(page, size);
    }

    search(query: any, page: number, size: number): Observable<Object> {
        return this.service.search(query, page, size);
    }

    preProcessResources(resources: Workout[]): Workout[] {
        return this.extract(resources);
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

    extract(res: Object): Workout[] {
        return res['content'];
    }
}
