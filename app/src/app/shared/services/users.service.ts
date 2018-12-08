import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {Observable} from "rxjs";
import {User} from "../model";

@Injectable()
export class UserService {

    constructor(private http: HttpClient) {}

    put(user: User): Observable<Object> {
        return this.http.put(`/users/${user.id}`, user);
    }

    findById(id: number): Observable<Object> {
        return this.http.get(`/users/${id}`)
    }

    findByEmail(email: string): Observable<Object> {
        return this.http.get(`/users/findByEmail?email=${email}`)
    }

    post(user: User): Observable<Object> {
        return this.http.post( `/authentication/${user.type}/registration`, user);
    }

    get(page: number, size: number) : Observable<Object> {
        return this.http.get(`/users?page=${page}&size=${size}&sort=lastName`);
    }

    search(query:string, page: number, size: number): Observable<Object> {
        return this.http.get(`/users/search?query=${query}&page=${page}&size=${size}&sort=lastName`);
    }

    patch(user: User) : Observable<Object> {
        return this.http.patch(`/users/${user.id}`, user);
    }

    addRole(userId: any, roleType: any) {
        // TODO change method to PUT
        let roleId = (roleType == "customer") ? 3 : (roleType == "trainer") ? 2 : 1;
        return this.http.get(`/users/${userId}/roles/${roleId}`);
    }

    getRoles(id: number): Observable<Object> {
        return this.http.get(`/users/${id}/roles`)
    }

    getCurrentTrainingBundles(id: number) : Observable<Object> {
        return this.http.get(`/customers/${id}/currentTrainingBundles`);
    }

}