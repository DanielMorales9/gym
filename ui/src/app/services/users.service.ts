import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {User} from "../users/user.interface";

@Injectable()
export class UserService {

    constructor(private http: HttpClient) {}

    put(user: User, success?: (value: any) => void, error?: (error: any) => void) {
        let endpoint = '';
        if (user['_links']) {
            endpoint = user['_links']['self']['href'];
        }
        else {
            endpoint = "/users/"+user.id
        }
        console.log(endpoint);
        this.http.put(endpoint, user).subscribe(success, error);
    }

    findById(id: number, success: (res) => void, error: (err) => void) {
        this.http.get("/users/" + id).subscribe(success, error)
    }

    findByEmail(email: string, success: (res) => void, error: (err) => void) {
        this.http.get("/users/findByEmail?email=" + email).subscribe(success, error)
    }

    post(user: User, success: (res) => void, error: (err) => void) {
        this.http.post( "/auth/" + user.type + "/registration", user).subscribe(success, error)
    }

    get(page: number, size: number, success: (res) => void, error: (error1) => void) {
        this.http.get("/users?page="+page+"&size="+size+"&sort=lastName").subscribe(success, error)
    }

    search(query:string, page: number, size: number, success: (res) => void, error: (error1) => void) {
        this.http.get("/users/search?query="+query+"&page="+page+"&size="+size+"&sort=lastName")
            .subscribe(success, error)
    }

    patch(user: any, success: (res) => void, error: (err) => void) {
        var endpoint = "/users/"+user.id;
        this.http.patch(endpoint, user).subscribe(success, error);
    }

    addRole(userId: any, roleType: any, success: (res) => void, error: (err) => void) {
        let roleId = (roleType == "customer") ? 3 : (roleType == "trainer") ? 2 : 1;
        let endpoint = "/users/"+userId+"/roles/"+roleId;
        this.http.get(endpoint).subscribe(success, error);
    }

    getRoles(user: any, success: (res) => void, error: (err) => void) {
        let endpoint = "/users/"+user.id+"/roles";
        this.http.get(endpoint).subscribe(success, error);
    }

    getCurrentTrainingBundles(id: number, success: (res) => void, error: (err) => void) {
        this.http.get("/customers/"+id+"/currentTrainingBundles").subscribe(success, error)
    }
}