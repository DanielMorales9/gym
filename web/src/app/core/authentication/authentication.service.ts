import {Injectable} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {to_promise} from '../functions/decorators';
import {User} from '../../shared/model';
import {StorageService} from './storage.service';
import {catchError, map, switchMap, throttleTime} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';


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

    private readonly TTL = environment.production ? 10000 : 0;
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
    login(credentials?: Credentials): Observable<any> {
        return this.authenticate(credentials).pipe(switchMap(
            data => {
                if (!!data) {
                    return this.getUserDetails(data['principal']['username']);
                }
                return of(data);
            }
        ));
    }

    private getUserDetails(username): Observable<any> {
        return this.getUserByEmail(username).pipe(
            catchError(err => of(null)),
            map(v => {
                if (!!v) {
                    this.user = v;
                    this.storageService.set(this.USER_KEY, this.user, this.remember);
                }
                return v;
            })
        );
    }

    private getUserByEmail(username): Observable<any> {
        const user = this.getWithExpiry(this.USER_EXPIRE_KEY);
        let res;
        if (!(!!user && user.email === username)) {
            res = this.findUserByEmail(username).pipe(
                catchError(err => of(null)),
                map(u => {
                    if (!!u) {
                        this.setWithExpiry(this.USER_EXPIRE_KEY, u, this.TTL);
                    }
                    return u;
                }
            ));
        }
        else {
            res = of(user);
        }
        return res;
    }

    /**
     * Authenticates the user.
     * @param credentials The login parameters.
     * @return The principal data.
     */
    authenticate(credentials?: Credentials): Observable<any> {
        this.remember = credentials ? credentials.remember : false;
        if (credentials) {
            this.storageService.set(this.CREDENTIAL_KEY, credentials, this.remember);
        }
        return this.getPrincipal()
            .pipe(map(v => {
                if (!v) {
                    this.storageService.set(this.CREDENTIAL_KEY);
                }
                return v;
        }));
    }


    private getPrincipal(): Observable<any> {
        const principal = this.getWithExpiry(this.PRINCIPAL_EXPIRE_KEY);
        let ret;
        if (!principal) {
            ret = this.signIn()
                .pipe(throttleTime(300), catchError(err => of(undefined)),
                    map(v => {
                        if (!!v) {
                            this.setWithExpiry(this.PRINCIPAL_EXPIRE_KEY, v, this.TTL);
                        }
                        return v;
                    }));

        }
        else {
            ret = of(principal);
        }

        return ret;
    }

    /**
     * Logs out the user and clear credentials.
     * @return True if the user was logged out successfully.
     */
    logout(): Observable<any> {
        // Customize credentials invalidation here
        return this.signOut().pipe(map( _ => {
                this.currentRole = undefined;
                this.storageService.set(this.CREDENTIAL_KEY);
                this.storageService.set(this.USER_KEY);
                localStorage.removeItem(this.USER_EXPIRE_KEY);
                localStorage.removeItem(this.PRINCIPAL_EXPIRE_KEY);
                localStorage.removeItem(this.GYM_EXPIRE_KEY);

            }
        ));
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

    getCurrentUserRoleId() {
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
        const idx = this.getCurrentUserRoleId();
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

    private signIn(): Observable<any> {
        return this.http.get('/user');
    }

    private signOut(): Observable<any> {
        return this.http.get('/logout');
    }

    private findUserByEmail(email: string): Observable<any> {
        return this.http.get(`/users/findByEmail?email=${email}`);
    }

    hasUser() {
        const user = this.getUser() as any;
        return !!user && Object(user.keys).length > 0;
    }

    getGym(): Observable<any> {
        let res;
        const gym = this.getWithExpiry(this.GYM_EXPIRE_KEY);

        if (!gym) {
            res = this.getConfig()
                .pipe(map(v => {
                    this.setWithExpiry(this.GYM_EXPIRE_KEY, v, this.TTL);
                    return v;
            }));
        }
        else {
            res = of(gym);
        }

        return res;
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
            // If the item is expired, deleteBundleSpecs the item from storage
            // and return null
            localStorage.removeItem(key);
            return null;
        }
        return item.value;
    }

    getConfig(): any {
        return this.http.get(`/gyms`).pipe(
            throttleTime(300),
            map((res: Object) => res[0])
        );
    }

}
