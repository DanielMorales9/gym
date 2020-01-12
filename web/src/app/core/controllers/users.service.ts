import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {to_promise} from '../functions/decorators';

@Injectable()
export class UserService {

    constructor(private http: HttpClient) {}

    @to_promise
    findById(id: number): any {
        return this.http.get(`/users/${id}`);
    }

    @to_promise
    findByEmail(email: string): any {
        return this.http.get(`/users/findByEmail?email=${email}`);
    }

    get(page: number, size: number): any {
        return this.http.get(`/users?page=${page}&size=${size}&sort=lastName`);
    }

    search(query: string, page: number, size: number): Observable<Object> {
        return this.http.get(`/users/search?query=${query}&page=${page}&size=${size}&sort=lastName`);
    }

    @to_promise
    patch(user): any {
        return this.http.patch(`/users/${user.id}`, user);
    }

    @to_promise
    delete(id: number): any {
        return this.http.delete(`/users/${id}`);
    }

    searchCustomerByLastName(query: any, page: number, size: number) {
        return this.http.get(`/customers/search?query=${query}&page=${page}&size=${size}&sort=lastName`);

    }

    getCustomers(page: number, size: number) {
        return this.http.get(`/customers?page=${page}&size=${size}&sort=lastName`);
    }

    getBundles(query: any, page: number, size: number) {
        query['page'] = page;
        query['size'] = size;
        return this.http.get('/customers/bundles', {params: query});
    }
}
