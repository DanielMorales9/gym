import {Observable} from 'rxjs';

export abstract class DataSourceService {

    abstract get(page: number, size: number): Observable<Object>;

    abstract search(query: any, page: number, size): Observable<Object>;
}
