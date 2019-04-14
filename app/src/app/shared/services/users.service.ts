import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../model';

@Injectable()
export class UserService {

    constructor(private http: HttpClient) {}

    put(user: User): Observable<Object> {
        return this.http.put(`/users/${user.id}`, user);
    }

    findById(id: number): Observable<Object> {
        return this.http.get(`/users/${id}`);
    }

    findByEmail(email: string): Observable<Object> {
        return this.http.get(`/users/findByEmail?email=${email}`);
    }

    get(page: number, size: number): Observable<Object> {
        return this.http.get(`/users?page=${page}&size=${size}&sort=lastName`);
    }

    search(query: string, page: number, size: number): Observable<Object> {
        return this.http.get(`/users/search?query=${query}&page=${page}&size=${size}&sort=lastName`);
    }

    patch(user): Observable<Object> {
        return this.http.patch(`/users/${user.id}`, user);
    }

    getRoles(id: number): Observable<Object> {
        return this.http.get(`/users/${id}/roles`);
    }

    getCurrentTrainingBundles(id: number): Observable<Object> {
        return this.http.get(`/customers/${id}/currentTrainingBundles`);
    }

    delete(id: number) {
        return this.http.delete(`/users/${id}`);
    }
}
