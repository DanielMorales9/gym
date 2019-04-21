import {Observable} from 'rxjs';

export abstract class HelperService<T> {

    abstract get(page: number, size: number): Observable<Object>;

    abstract search(query: any, page: number, size: number): Observable<Object>;

    abstract getOrSearch(query: any, page: number, size: number): Observable<Object>;

    abstract preProcessResources(resources: Object): T[];

    abstract extract(resources: Object): T[];

    public getLength(resources: Object): number {
        let length;
        if (resources['page']) {
            length = resources['page']['totalElements'];
        } else {
            length = resources['totalElements'];
        }

        return length;

    }
}
