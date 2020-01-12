import {Injectable} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {to_promise} from '../functions/decorators';
import {User} from '../../shared/model';
import {StorageService} from './storage.service';


export interface Credentials {
    // Customize received credentials here
    username: string;
    password: string;
    remember: boolean;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    private readonly CREDENTIAL_KEY = 'credentials';
    private readonly USER_KEY = 'user';

    private user: User;
    private remember: boolean;
    private currentRole: number;
    private TYPE2INDEX = {
        'A': 1,
        'T': 2,
        'C': 3
    };

    constructor(private http: HttpClient,
                private storageService: StorageService) { }

    /**
     * logs-in the user.
     * @param credentials The login parameters.
     * @return The user data.
     */
    async login(credentials?: Credentials): Promise<any> {
        let [data, error] = await this.authenticate(credentials);
        if (!error) {
            [data, error] = await this.findUserByEmail(data['principal']['username']);
            if (!error) {
                this.user = data;
                this.storageService.set(this.USER_KEY, this.user, this.remember);
            }
            else {
                [data, error] = [this.user, undefined];
            }
        }

        return [data, error];
    }

    /**
     * Authenticates the user.
     * @param credentials The login parameters.
     * @return The principal data.
     */
    async authenticate(credentials?: Credentials): Promise<any> {
        this.remember = credentials ? credentials.remember : false;
        if (credentials) {
            this.storageService.set(this.CREDENTIAL_KEY, credentials, this.remember);
        }

        const [data, error] = await this.signIn();
        if (error) {
            this.storageService.set(this.CREDENTIAL_KEY);
        }
        return [data, error];
    }

    /**
     * Logs out the user and clear credentials.
     * @return True if the user was logged out successfully.
     */
    async logout(): Promise<any> {
        // Customize credentials invalidation here
        const [data, error] = await this.signOut();
        console.log([data, error]);
        if (!error) {
            this.currentRole = undefined;
            this.storageService.set(this.CREDENTIAL_KEY);
            this.storageService.set(this.USER_KEY);
        }
        return [data, error];
    }

    public getAuthorizationHeader() {
        if (!this.isAuthenticated()) {
            return 'Basic ';
        }
        const credentials = this.storageService.get(this.CREDENTIAL_KEY);
        return 'Basic ' + btoa(credentials.username + ':' + credentials.password);
    }

    isAuthenticated() {
        return !!this.storageService.get(this.CREDENTIAL_KEY);
    }

    getCurrentUserRole() {
        const user = this.getUser();
        this.currentRole = this.computeRole(user);
        return this.currentRole;
    }

    computeRole(user: User) {
        if (user.type) {
            return this.TYPE2INDEX[this.user.type];
        } else {
            return 3;
        }
    }

    getUser(): User {
        if (!this.user) {
            this.user = this.storageService.get(this.USER_KEY) || {};
        }
        return this.user;
    }

    @to_promise
    private signIn(): any {
        return this.http.get('/user');
    }

    @to_promise
    private signOut(): any {
        return this.http.get('/logout');
    }

    @to_promise
    private findUserByEmail(email: string): any {
        return this.http.get(`/users/findByEmail?email=${email}`);
    }
}
