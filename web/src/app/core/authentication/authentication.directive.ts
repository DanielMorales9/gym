import {Directive, Injectable, OnDestroy} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {Credentials, Gym, Roles, TypeIndex, User} from '../../shared/model';
import {catchError, map, switchMap, throttleTime} from 'rxjs/operators';
import {Observable, of, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {CredentialsStorageDirective} from './credentials-storage.directive';
import {PrincipalStorageDirective} from './principal-storage.directive';
import {UserStorageDirective} from './user-storage.directive';
import {CurrentUserRoleIdStorageDirective} from './current-user-role-id-storage.directive';
import {GymStorageDirective} from "./gym-storage.directive";

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Directive()
@Injectable({
    providedIn: 'root'
})
export class AuthenticationDirective implements OnDestroy {

    private unsubscribe$ = new Subject<any>();

    // TODO remove
    private onAuthenticate$ = new Subject<boolean>();

    constructor(private http: HttpClient,
                private credentialsStorage: CredentialsStorageDirective,
                private userStorage: UserStorageDirective,
                private gymStorage: GymStorageDirective,
                private principalStorage: PrincipalStorageDirective,
                private currentRoleIdStorage: CurrentUserRoleIdStorageDirective,
                private router: Router) { }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    /**
     * logs-in the user
     * @param credentials The login parameters.
     * @return The user data.
     */
    login(credentials?: Credentials): Observable<any> {
        return this.authenticate(credentials)
            .pipe(switchMap(principal => this.getUserDetails(principal)));
    }

    getUserDetails(principal): Observable<User> {
        const user = this.userStorage.get();
        let obs;
        if (!!principal && !user) {
            const email = principal['name'];
            obs = this.findUserByEmail(email).pipe(
                map((u: any) => {
                    this.setUser(u);
                    return u;
                })
            );
        }
        else if (!!user) {
            obs = of(user);
            this.setUser(user);
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
        this.credentialsStorage.set(credentials);
        return this.getPrincipal()
            .pipe(map(principal => {
                if (!principal) {
                    this.credentialsStorage.unset();
                }
                return principal;
            }));
    }

    private getPrincipal(): Observable<any> {
        const principal = this.principalStorage.get();
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
                this.userStorage.unset();
                this.currentRoleIdStorage.unset();
                this.principalStorage.unset();
                this.credentialsStorage.unset();
                this.gymStorage.unset();
                this.onAuthenticate$.next(false);
            }
        ));
    }

    isAuthenticated() {
        return !!this.credentialsStorage.get();
    }

    onAuthenticate(): Subject<boolean> {
        return this.onAuthenticate$;
    }

    // TODO Remove
    getRoleByUser(user: User) {
        if (user.type) {
            return TypeIndex[user.type];
        } else {
            return 3;
        }
    }

    private setUser(user: User) {
        const currentRoleId = this.getCurrentUserRoleId();
        if (!currentRoleId) {
            this.setCurrentUserRoleId(TypeIndex[user.type]);
        }
        this.userStorage.set(user);
        this.onAuthenticate$.next(true);
    }

    setCurrentUserRoleId(idx?: number) {
        this.currentRoleIdStorage.set(idx);
    }

    getUser(): User {
        return this.userStorage.get();
    }

    getCurrentUserRoleId() {
        return this.currentRoleIdStorage.get();
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

    findGym(): Observable<Gym> {
        let res;
        const gym = this.gymStorage.get()
        if (!gym) {
            res = this.getGym()
                .pipe(map((v: Gym) => {
                    this.gymStorage.set(v);
                    return v;
                }));
        }
        else {
            res = of(gym);
        }

        return res;
    }

    getGym(): Observable<Gym> {
        return this.http.get(`/gyms`).pipe(
            map((res: Object) => res[0])
        );
    }

    navigateByRole(...paths): void {
        const currentUserRoleId = this.getCurrentUserRoleId();
        const roleName = Roles[currentUserRoleId - 1];
        const _ = this.router.navigate([roleName, ...paths]);
    }
}
