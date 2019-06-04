import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../shared/model';
import {Observable} from 'rxjs';
import {AppService} from './app.service';

@Injectable()
export class AuthService {

    constructor(private http: HttpClient,
                private appService: AppService) {}

    forgotPassword(email: string) {
        this.appService.credentials = undefined;
        return this.http.get(`/authentication/forgotPassword?email=${email}`);
    }

    getUserFromVerificationToken(token: any) {
        this.appService.credentials = undefined;
        return this.http.get('/authentication/getUserFromVerificationToken', {params: {token: token}});
    }

    registration(user: User, gymId: any): Observable<Object> {
        return this.http.post(`/authentication/registration?gymId=${gymId}`, user);
    }

    resendToken(token: string) {
        this.appService.credentials = undefined;
        return this.http.get('/authentication/resendToken', {params: {token: token}});
    }

    resendTokenAnonymous(id: number) {
        return this.http.get(`/authentication/resendAnonymousToken?id=${id}`);
    }

    changePassword(id: number, form: { password: string; oldPassword: string, confirmPassword: string }) {
        this.appService.credentials = undefined;
        return this.http.post(`/authentication/changePassword/${id}`, form);
    }

    confirmRegistration(credentials) {
        this.appService.credentials = undefined;
        return this.http.post( `/authentication/confirmRegistration`, credentials);
    }
}
