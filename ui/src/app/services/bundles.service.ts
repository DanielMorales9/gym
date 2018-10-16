import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {Bundle} from "../bundles/bundle.interface";

@Injectable()
export class BundlesService {

    constructor(private http: HttpClient) {}

    put(bundle: Bundle, success?: (value: any) => void, error?: (error: any) => void) {
        var endpoint = '';
        if (bundle['_links']) {
            endpoint = bundle['_links']['self']['href'];
        }
        else {
            endpoint = "/pBundleSpecs/"+bundle.id
        }
        this.http.put(endpoint, bundle).subscribe(success, error);
    }

    post(bundle: Bundle, success: (res) => void, error: (err) => void) {
        this.http.post("/bundleSpecs", bundle).subscribe(success, error)
    }

    get(page: number, size: number, success: (res) => void, error: (error1) => void) {
        this.http.get("/bundleSpecs?page="+page+"&size="+size+"&sort=name").subscribe(success, error)
    }

    search(query:string, page: number, size: number, success: (res) => void, error: (error1) => void) {
        this.http.get("/bundleSpecs/search?query="+query+"&page="+page+"&size="+size+"&sort=createdAt,desc&sort=name,asc").subscribe(success, error)
    }

    searchNotDisabled(query: string, page: number, size: number, success: (res) => void, error: (err) => void) {
        this.http.get("/bundleSpecs/searchNotDisabled?query="+query+"&page="+page+"&size="+size+"&sort=createdAt,desc&sort=name,asc").subscribe(success, error)
    }

    getNotDisabled(page: number, size: number, success: (res) => void, error: (err) => void) {
        this.http.get("/bundleSpecs/getNotDisabled?page="+page+"&size="+size+"&sort=createdAt,desc&sort=name,asc").subscribe(success, error)
    }

    getSessions(endpoint, success: (res) => void, error: (err) => void) {
        this.http.get(endpoint).subscribe(success, error)
    }

}