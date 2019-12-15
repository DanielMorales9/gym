import {Observable} from 'rxjs';

export abstract class ABundleService {
    abstract get(page: number, size: number): Observable<Object>;

    abstract search(query: string, page: number, size): Observable<Object>;
}
