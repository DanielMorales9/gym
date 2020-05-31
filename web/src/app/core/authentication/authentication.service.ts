import {Injectable, OnDestroy, OnInit} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {Credentials, Role, Roles, TypeIndex, User} from '../../shared/model';
import {StorageService} from './storage.service';
import {catchError, map, switchMap, takeUntil, throttleTime} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {Observable, of, Subject} from 'rxjs';

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
    providedIn: 'root'
})
export class AuthenticationService implements OnInit, OnDestroy {

    private readonly CREDENTIAL_KEY = 'credentials';
    private readonly USER_KEY = 'user';
    private readonly USER_EXPIRE_KEY = 'user_ttl';
    private readonly PRINCIPAL_EXPIRE_KEY = 'principal_ttl';
    private readonly ROLE_KEY = 'role';
    private readonly GYM_EXPIRE_KEY: 'gym_ttl';

    private readonly TTL = environment.production ? 10000 : 0;

    private unsubscribe$ = new Subject<any>();
    private currentRoleId$ = new Subject<number>();
    private roles$ = new Subject<Role[]>();

    private user: User;
    private currentRoleId: number;
    private remember: boolean;

    constructor(private http: HttpClient,
                private storageService: StorageService) { }

    ngOnInit() {
        this.currentRoleId$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(v => {
            this.currentRoleId = v;
            this.storageService.set(this.ROLE_KEY, this.currentRoleId);
        });

        this.roles$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(v => {
                this.currentRoleId$.next(this.currentRoleId || v[0].id);
            });
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

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
        ), map(u => {
            this.setRoles(u);
            return u;
        }));
    }

    private setRoles(u: User) {
        if (!!u && !!u.roles) {
            this.roles$.next(u.roles);
        }
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
                .pipe(throttleTime(300),
                    catchError(err => of(undefined)),
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
                this.currentRoleId = undefined;
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
        return this.getRoleByUser(user);
    }

    getRoleByUser(user: User) {
        if (user.type) {
            return TypeIndex[this.user.type];
        } else {
            return 3;
        }
    }

    getCurrentUserRoleId() {
        return this.currentRoleId$;
    }

    getUser(): User {
        if (!this.user) {
            this.user = this.storageService.get(this.USER_KEY) || {};
        }
        return this.user;
    }

    getUserRoleName(currentRoleId?) {
        const idx = currentRoleId || this.currentRoleId || 1;
        return Roles[idx - 1];
    }

    getRoles(): Subject<Role[]> {
        return this.roles$;
    }

    setCurrentUserRole(idx?: number) {
        this.currentRoleId$.next(idx);
    }

    private getDefaultRole() {
        const user = this.getUser();
        return this.getRoleByUser(user);
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
