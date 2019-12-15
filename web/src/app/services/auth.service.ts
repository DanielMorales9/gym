import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../shared/model';
import {to_promise} from '../shared/directives/decorators';

@Injectable()
export class AuthService {

    constructor(private http: HttpClient) {}

    @to_promise
    forgotPassword(email: string): any {
        return this.http.get(`/authentication/forgotPassword?email=${email}`);
    }

    @to_promise
    getUserFromVerificationToken(token: any): any {
        return this.http.get('/authentication/getUserFromVerificationToken', {params: {token: token}});
    }

    @to_promise
    registration(user: User): any {
        return this.http.post(`/authentication/registration`, user);
    }

    @to_promise
    resendToken(token: string): any {
        return this.http.get('/authentication/resendToken', {params: {token: token}});
    }

    @to_promise
    resendTokenAnonymous(id: number): any {
        return this.http.get(`/authentication/resendTokenAnonymous?id=${id}`);
    }

    @to_promise
    changePassword(id: number, form: { password: string; oldPassword: string, confirmPassword: string }): any {
        return this.http.post(`/authentication/changePassword/${id}`, form);
    }

    @to_promise
    changePasswordAnonymous(id: number, form: { password: string; oldPassword: string, confirmPassword: string }): any {
        return this.http.post(`/authentication/changePasswordAnonymous/${id}`, form);
    }

    @to_promise
    confirmRegistration(credentials): any {
        return this.http.post( `/authentication/confirmRegistration`, credentials);
    }
}
