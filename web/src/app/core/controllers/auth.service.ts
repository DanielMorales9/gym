import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../../shared/model';
import {Observable} from 'rxjs';

@Injectable()
export class AuthService {

    constructor(private http: HttpClient) {}

    forgotPassword(email: string): Observable<any> {
        return this.http.get(`/authentication/forgotPassword?email=${email}`);
    }

    getUserFromVerificationToken(token: any): Observable<any> {
        return this.http.get('/authentication/getUserFromVerificationToken', {params: {token: token}});
    }

    registration(user: User): Observable<any> {
        return this.http.post(`/authentication/registration`, user);
    }

    resendToken(token: string): Observable<any> {
        return this.http.get('/authentication/resendToken', {params: {token: token}});
    }

    resendTokenAnonymous(id: number): Observable<any> {
        return this.http.get(`/authentication/resendTokenAnonymous?id=${id}`);
    }

    changePassword(id: number, form: { password: string; oldPassword: string, confirmPassword: string }): Observable<any> {
        return this.http.post(`/authentication/changePassword/${id}`, form);
    }

    changePasswordAnonymous(id: number, form: { password: string; oldPassword: string, confirmPassword: string }): Observable<any> {
        return this.http.post(`/authentication/changePasswordAnonymous/${id}`, form);
    }

    confirmRegistration(credentials): Observable<any> {
        return this.http.post( `/authentication/confirmRegistration`, credentials);
    }
}
