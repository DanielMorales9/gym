import {Directive, Injectable} from "@angular/core";
import {StorageService} from "./storage.service";
import {Credentials} from "../../shared/model";

@Directive()
@Injectable({
    providedIn: 'root'
})
export class CredentialsStorage {
    private readonly CREDENTIAL_KEY = 'credentials';

    private remember: boolean;

    constructor(private storageService: StorageService) {
    }

    rememberMe(): boolean {
        return this.remember;
    }

    get(): Credentials {
        return this.storageService.get(this.CREDENTIAL_KEY);
    }

    set(credentials: Credentials) {
        if (!this.remember) {
            this.remember = credentials ? credentials.remember : false
        }
        
        if (credentials) {
            this.storageService.set(this.CREDENTIAL_KEY, credentials, this.remember);
        }
    }

    unset() {
        this.storageService.set(this.CREDENTIAL_KEY);
    }
}