import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../shared/model';
import {Observable} from 'rxjs';
import {to_promise} from '../shared/directives/decorators';

@Injectable()
export class AuthService {

    constructor(private http: HttpClient) {}

    forgotPassword(email: string) {
        return this.http.get(`/authentication/forgotPassword?email=${email}`);
    }

    getUserFromVerificationToken(token: any) {
        return this.http.get('/authentication/getUserFromVerificationToken', {params: {token: token}});
    }

    registration(user: User): Observable<Object> {
        return this.http.post(`/authentication/registration`, user);
    }

    resendToken(token: string) {
        return this.http.get('/authentication/resendToken', {params: {token: token}});
    }

    resendTokenAnonymous(id: number) {
        return this.http.get(`/authentication/resendTokenAnonymous?id=${id}`);
    }

    changePassword(id: number, form: { password: string; oldPassword: string, confirmPassword: string }) {
        return this.http.post(`/authentication/changePassword/${id}`, form);
    }

    changePasswordAnonymous(id: number, form: { password: string; oldPassword: string, confirmPassword: string }) {
        return this.http.post(`/authentication/changePasswordAnonymous/${id}`, form);
    }

    @to_promise
    confirmRegistration(credentials): any {
        return this.http.post( `/authentication/confirmRegistration`, credentials);
    }
}
