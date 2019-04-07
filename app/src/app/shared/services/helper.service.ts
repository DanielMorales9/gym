import {Observable} from 'rxjs';

export abstract class HelperService<T> {

    abstract get(page: number, size: number): Observable<Object>;

    abstract search(query: any, page: number, size: number): Observable<Object>;

    abstract preProcessResources(resources: T[]): T[];

    abstract extract(resources: T[]): T[];

    public getLength(resources: T[]): number {
        let length;
        if (resources['page'])
            length = resources['page']['totalElements'];
        else
            length = resources['totalElements'];

        return length

    }
}
