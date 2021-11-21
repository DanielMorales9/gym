import {Directive, Injectable} from "@angular/core";
import {StorageService} from "./storage.service";
import {Credentials} from "../../shared/model";
import {environment} from "../../../environments/environment";

@Directive()
@Injectable({
    providedIn: 'root'
})
export class PrincipalStorage {

    private readonly PRINCIPAL_KEY = 'principal';

    constructor(private storageService: StorageService) {
    }

    get() {
        return this.storageService.getWithExpiry(this.PRINCIPAL_KEY);
    }

    set(principal: any) {
        this.storageService.setWithExpiry(this.PRINCIPAL_KEY, principal);
    }

    unset() {
        this.storageService.set(this.PRINCIPAL_KEY);
    }
}