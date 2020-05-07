import {Injectable} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {to_promise} from '../functions/decorators';
import {User} from '../../shared/model';
import {StorageService} from './storage.service';
import {map} from 'rxjs/operators';


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
    private readonly USER_EXPIRE_KEY = 'user_ttl';
    private readonly PRINCIPAL_EXPIRE_KEY = 'principal_ttl';
    private readonly ROLE_KEY = 'role';
    private readonly GYM_EXPIRE_KEY: 'gym_ttl';

    private readonly TTL = 10000;
    private user: User;
    private remember: boolean;
    private currentRole: number;

    private TYPE2INDEX = {
        'A': 1,
        'T': 2,
        'C': 3
    };

    private TYPE2NAME = {
        'A': 'admin',
        'T': 'trainer',
        'C': 'customer'
    };

    private INDEX2NAME = [
        'admin',
        'trainer',
        'customer'
    ];
    private ROLE2NAME = {
        'ADMIN': 'Amministratore',
        'TRAINER': 'Allenatore',
        'CUSTOMER': 'Cliente'
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
            [data, error] = await this.getUserDetails(data['principal']['username']);
        }
        return [data, error];
    }

    private async getUserDetails(username) {
        let [data, error] = await this.getUserByEmail(username);
        if (!error) {
            this.user = data;
            this.storageService.set(this.USER_KEY, this.user, this.remember);
        } else {
            [data, error] = [this.user, undefined];
        }
        return [data, error];
    }

    private async getUserByEmail(username) {
        let user = this.getWithExpiry(this.USER_EXPIRE_KEY);
        let error;
        if (!(!!user && user.email === username)) {
            [user, error] = await this.findUserByEmail(username);
            if (!!user) {
                this.setWithExpiry(this.USER_EXPIRE_KEY, user, this.TTL);
            }
        }
        return [user, error];
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
        const [data , error] = await this.getPrincipal();
        if (!!error) {
            this.storageService.set(this.CREDENTIAL_KEY);
        }

        return [data , error];
    }


    private async getPrincipal() {
        let principal = this.getWithExpiry(this.PRINCIPAL_EXPIRE_KEY);
        let error;
        if (!principal) {
            [principal, error] = await this.signIn();
            this.setWithExpiry(this.PRINCIPAL_EXPIRE_KEY, principal, this.TTL);
        }

        return [principal, error];
    }

    /**
     * Logs out the user and clear credentials.
     * @return True if the user was logged out successfully.
     */
    async logout(): Promise<any> {
        // Customize credentials invalidation here
        const [data, error] = await this.signOut();
        if (!error) {
            this.currentRole = undefined;
            this.storageService.set(this.CREDENTIAL_KEY);
            this.storageService.set(this.USER_KEY);
            localStorage.removeItem(this.USER_EXPIRE_KEY);
            localStorage.removeItem(this.PRINCIPAL_EXPIRE_KEY);
            localStorage.removeItem(this.GYM_EXPIRE_KEY);
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

    getPrincipalRole() {
        const user = this.getUser();
        this.currentRole = this.getRoleByUser(user);
        return this.currentRole;
    }

    getRoleByUser(user: User) {
        if (user.type) {
            return this.TYPE2INDEX[this.user.type];
        } else {
            return 3;
        }
    }

    getCurrentUserRole() {
        if (!this.currentRole) {

            this.currentRole = this.getPrincipalRole();
            this.setCurrentUserRole(this.currentRole);
        }
        return this.currentRole;
    }

    hasRole(expectedRole: any) {
        const idx = this.TYPE2INDEX[expectedRole];
        return this.getRoles().filter( v => v.id === idx).length === 1;
    }

    getUser(): User {
        if (!this.user) {
            this.user = this.storageService.get(this.USER_KEY) || {};
        }
        return this.user;
    }

    getUserRoleName() {
        const idx = this.getCurrentUserRole();
        return this.INDEX2NAME[idx - 1];
    }

    getRoles(): any[] {
        return (this.getUser().roles || []).map(v => new Object({id: v.id, name: this.ROLE2NAME[v.name]}));
    }

    setCurrentUserRole(idx?: number) {
        this.currentRole = idx;
        this.storageService.set(this.ROLE_KEY, this.currentRole);
    }

    private getDefaultRole() {
        const user = this.getUser();
        this.currentRole = this.getRoleByUser(user);
        return this.currentRole;
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

    hasUser() {
        const user = this.getUser() as any;
        return !!user && Object(user.keys).length > 0;
    }

    async getGym(): Promise<any> {
        let gym = this.getWithExpiry(this.GYM_EXPIRE_KEY);
        let error;
        if (!gym) {
            [gym, error] = await this.getConfig();
            if (!!gym) {
                this.setWithExpiry(this.GYM_EXPIRE_KEY, gym, this.TTL);
            }
        }

        return [gym, error];
    }

    setWithExpiry(key, value, ttl) {
        const now = new Date();

        // `item` is an object which contains the original value
        // as well as the time when it's supposed to expire
        const item = {
            value: value,
            expiry: now.getTime() + ttl
        };
        localStorage.setItem(key, JSON.stringify(item));
    }

    getWithExpiry(key) {
        const itemStr = localStorage.getItem(key);
        // if the item doesn't exist, return null
        if (!itemStr) {
            return null;
        }
        const item = JSON.parse(itemStr);
        const now = new Date();
        // compare the expiry time of the item with the current time
        if (now.getTime() > item.expiry) {
            // If the item is expired, delete the item from storage
            // and return null
            localStorage.removeItem(key);
            return null;
        }
        return item.value;
    }

    @to_promise
    getConfig(): any {
        return this.http.get(`/gyms`).pipe(map(v => v[0]));
    }

}
