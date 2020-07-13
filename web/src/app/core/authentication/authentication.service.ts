import { Injectable, OnDestroy, OnInit, Directive } from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {Credentials, Gym, Role, Roles, TypeIndex, User} from '../../shared/model';
import {StorageService} from './storage.service';
import {catchError, map, switchMap, takeUntil, throttleTime} from 'rxjs/operators';
import {Observable, of, Subject} from 'rxjs';
import {environment} from '../../../environments/environment';

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Directive()
@Injectable({
    providedIn: 'root'
})
export class AuthenticationService implements OnInit, OnDestroy {

    private readonly CREDENTIAL_KEY = 'credentials';
    private readonly ROLE_KEY = 'role';

    private readonly PRINCIPAL_EXPIRE_KEY = 'principal_ttl';
    private readonly TTL = environment.production ? 10000 : 0;

    private unsubscribe$ = new Subject<any>();
    private currentRoleId$ = new Subject<number>();
    private roles$ = new Subject<Role[]>();
    private user$ = new Subject<User>();

    private user: User;
    private gym: Gym;
    private currentRoleId: number;
    private remember: boolean;

    constructor(private http: HttpClient,
                private storageService: StorageService) { }

    ngOnInit() {
        this.currentRoleId$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(v => {
                this.currentRoleId = v;
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
        return this.authenticate(credentials)
            .pipe(switchMap(data => this.getUserDetails(data)));
    }

    getUserDetails(principal): Observable<User> {
        let obs;
        if (!!principal && !this.user) {
            obs = this.findUserByEmail(principal['name']).pipe(
                map((v: any) => {
                    if (!!v) {
                        this.setUser(v);
                        this.setRoles(v.roles);
                    }
                    return v;
                })
            );
        }
        else if (!!this.user) {
            obs = of(this.user);
            this.setUser(this.user);
            this.setRoles(this.user.roles);
        }
        else {
            obs = of(principal);
        }

        return obs;
    }

    private setRoles(roles: Role[]) {
        this.roles$.next(roles);
    }

    private setUser(u: User) {
        this.user = u;
        this.user$.next(u);
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
                else {
                    const roles = v['authorities'].map((d, i) => new Role(TypeIndex[d.authority[0]], d.authority));
                    this.setRoles(roles);
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
                this.user = undefined;
                this.gym = undefined;
                this.currentRoleId = undefined;
                this.storageService.set(this.PRINCIPAL_EXPIRE_KEY);
                this.storageService.set(this.CREDENTIAL_KEY);
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

    getRoleByUser(user: User) {
        if (user.type) {
            return TypeIndex[this.user.type];
        } else {
            return 3;
        }
    }

    getObservableCurrentUserRoleId() {
        return this.currentRoleId$;
    }

    getObservableUser(): Observable<User> {
        return this.user$;
    }

    getUser(): User {
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
        this.currentRoleId = idx;
        this.currentRoleId$.next(idx);
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
        return !!this.user;
    }

    getGym(): Observable<Gym> {
        let res;
        if (!this.gym) {
            res = this.getConfig().pipe(map((v: Gym) => {
                this.gym = v;
                return v;
            }));
        }
        else {
            res = of(this.gym);
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
        this.storageService.set(key, JSON.stringify(item));
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
            this.storageService.set(key);
            return null;
        }
        return item.value;
    }

    getConfig(): Observable<Gym> {
        return this.http.get(`/gyms`).pipe(
            catchError(err => Array([undefined])),
            map((res: Object) => res[0])
        );
    }

    getCurrentUserRoleId() {
        return this.currentRoleId;
    }
}
