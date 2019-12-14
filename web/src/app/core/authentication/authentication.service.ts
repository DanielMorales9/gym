import {Injectable} from '@angular/core';

import {Credentials, CredentialsService} from './credentials.service';
import {HttpClient} from '@angular/common/http';
import {to_promise} from '../../shared/directives/decorators';

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
    async login(credentials?: Credentials): Promise<any> {
        if (credentials) { this.credentialsService.setCredentials(credentials); }

        const [data, error] = await this.signIn();
        if (error) {
            this.credentialsService.setCredentials();
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
        if (!error) {
            this.credentialsService.setCredentials();
        }
        return [data, error];
    }

    public getAuthorizationHeader() {
        if (!this.credentialsService.isAuthenticated()) {
            return 'Basic ';
        }
        const credentials = this.credentialsService.credentials;
        return 'Basic ' + btoa(credentials.username + ':' + credentials.password);
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
    private async getUser(email: string) {
        return this.http.get(`/users/findByEmail?email=${email}`);
    }
}
