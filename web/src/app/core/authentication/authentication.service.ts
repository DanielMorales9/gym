import {Directive, Injectable, OnDestroy} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {Credentials, Gym, Roles, TypeIndex, User} from '../../shared/model';
import {catchError, map, switchMap, throttleTime} from 'rxjs/operators';
import {Observable, of, Subject} from 'rxjs';
import {Router} from "@angular/router";
import {CredentialsStorage} from "./credentials.storage";
import {PrincipalStorage} from "./principal.storage";

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Directive()
@Injectable({
    providedIn: 'root'
})
export class AuthenticationService implements OnDestroy {

    private unsubscribe$ = new Subject<any>();
    private currentRoleId$ = new Subject<number>();
    private user$ = new Subject<User>();

    private user: User;
    private gym: Gym;
    private currentRoleId: number;

    constructor(private http: HttpClient,
                private credentialsStorage: CredentialsStorage,
                private principalStorage: PrincipalStorage,
                private router: Router) { }

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
            .pipe(switchMap(principal => this.getUserDetails(principal)));
    }

    getUserDetails(principal): Observable<User> {
        let obs;
        if (!!principal && !this.user) {
            obs = this.findUserByEmail(principal['name']).pipe(
                map((user: any) => {
                    if (!!user) {
                        this.setUser(user);
                    }
                    return user;
                })
            );
        }
        else if (!!this.user) {
            obs = of(this.user);
            this.setUser(this.user);
        }
        else {
            obs = of(undefined);
        }

        return obs;
    }

    /**
     * Authenticates the user.
     * @param credentials The login parameters.
     * @return The principal data.
     */
    authenticate(credentials?: Credentials): Observable<any> {
        this.credentialsStorage.set(credentials)
        return this.getPrincipal()
            .pipe(map(v => {
                if (!v) {
                    this.credentialsStorage.unset();
                }
                return v;
            }));
    }

    private getPrincipal(): Observable<any> {
        const principal = this.principalStorage.get()
        let ret;
        if (!principal) {
            const rememberMe = this.credentialsStorage.rememberMe();
            ret = this.signIn(rememberMe)
                .pipe(
                    throttleTime(300),
                    catchError(_ => of(undefined)),
                    map(v => {
                        if (!!v) {
                            this.principalStorage.set(v);
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
                this.principalStorage.unset();
                this.credentialsStorage.unset();
            }
        ));
    }

    isAuthenticated() {
        return !!this.credentialsStorage.get();
    }

    getRoleByUser(user: User) {
        if (user.type) {
            return TypeIndex[this.user.type];
        } else {
            return 3;
        }
    }

    private setUser(user: User) {
        if (!this.currentRoleId) {
            this.setCurrentUserRoleId(TypeIndex[user.type])
        }
        this.user = user;
        this.user$.next(user);
    }

    setCurrentUserRoleId(idx?: number) {
        this.currentRoleId = idx;
        this.currentRoleId$.next(idx);
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

    getCurrentUserRoleId() {
        return this.currentRoleId;
    }

    private signIn(rememberMe: boolean): Observable<any> {
        return this.http.get(`/user?rememberMe=${rememberMe}`);
    }

    private signOut(): Observable<any> {
        return this.http.get('/logout');
    }

    private findUserByEmail(email: string): Observable<any> {
        return this.http.get(`/users/findByEmail?email=${email}`);
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

    getConfig(): Observable<Gym> {
        return this.http.get(`/gyms`).pipe(
            catchError(_ => Array([undefined])),
            map((res: Object) => res[0])
        );
    }

    navigateByRole(...paths): void {
        const roleName = Roles[this.currentRoleId - 1];
        const _ = this.router.navigate([roleName, ...paths]);
    }
}
