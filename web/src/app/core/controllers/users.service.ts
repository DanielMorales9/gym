import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {to_promise} from '../functions/decorators';
import {filter, switchMap} from 'rxjs/operators';
import {User} from '../../shared/model';

@Injectable()
export class UserService {

    constructor(private http: HttpClient) {}

    findUserById(id: number): Observable<any> {
        return this.http.get(`/users/${id}`);
    }

    get(page: number, size: number): any {
        return this.http.get(`/users?page=${page}&size=${size}&sort=lastName`);
    }

    search(query: string, page: number, size: number): Observable<Object> {
        return this.http.get(`/users/search?query=${query}&page=${page}&size=${size}&sort=lastName`);
    }

    patchUser(user): Observable<Object> {
        return this.http.patch(`/users/${user.id}`, user);
    }

    deleteUser(id: number): any {
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

    @to_promise
    getBundleBySpecId(userId: number, specId: any): any {
        return this.http.get(`/customers/${userId}/currentTrainingBundles`,
            {params: {specId: specId}});
    }

    getUsersByEventId(eventId: any): Observable<any> {
        return this.http.get(`/users/events/`, {params: {eventId: eventId}});
    }

    getCurrentTrainingBundles(id: any): Observable<any> {
        return this.http.get(`/customers/${id}/currentTrainingBundles`);
    }

    uploadImage(id: number, data: FormData, param: any) {
        return this.http.post(`/users/${id}/image`, data, param);
    }

    retrieveImage(id: number) {
        return this.http.get(`/users/${id}/image`);
    }

    deleteUserWithConfirmation(user: User): Observable<any> {
        return of(confirm(`Vuoi rimuovere l'utente ${user.firstName} ${user.lastName}?`))
            .pipe(filter(a => !!a),
                switchMap(c => this.deleteUser(user.id)));
    }
}
