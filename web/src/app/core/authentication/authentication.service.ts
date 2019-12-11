import {Injectable} from '@angular/core';

import {Credentials, CredentialsService} from './credentials.service';
import {Observable, of, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    constructor(private http: HttpClient,
                private credentialsService: CredentialsService) { }

    /**
     * Authenticates the user.
     * @param credentials The login parameters.
     * @return The user credentials.
     */
    login(credentials?: Credentials): Observable<Object> {
        if (credentials) { this.credentialsService.setCredentials(credentials); }

        return this.http.get('/user')
            .pipe(
                tap(res => {
                    if (!!res) {
                        this.credentialsService.setCredentials();
                        throwError(new Error('No Auth'));
                    }
                    return res;
                })
            );
    }

    /**
     * Logs out the user and clear credentials.
     * @return True if the user was logged out successfully.
     */
    logout(): Observable<Object> {
        // Customize credentials invalidation here
        this.credentialsService.setCredentials();
        return this.http.get('/logout');
    }

    public getAuthorizationHeader() {
        if (!this.credentialsService.isAuthenticated()) {
            return 'Basic ';
        }
        const credentials = this.credentialsService.credentials;
        return 'Basic ' + btoa(credentials.username + ':' + credentials.password);
    }
}
