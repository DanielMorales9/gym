import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../shared/model';
import {Observable} from 'rxjs';
import {AppService} from './app.service';

@Injectable()
export class AuthService {

    constructor(private http: HttpClient,
                private appService: AppService) {}

    findByEmail(email: string) {
        this.appService.credentials = undefined;
        return this.http.get(`/authentication/findByEmail?email=${email}`);
    }

    getUserFromVerificationToken(token: any) {
        this.appService.credentials = undefined;
        return this.http.get('/authentication/verification',{params: {token: token}});
    }

    registration(user: User): Observable<Object> {
        return this.http.post( `/authentication/registration`, user);
    }

    resendToken(token: string) {
        this.appService.credentials = undefined;
        return this.http.get('/authentication/resendToken', {params: {token: token}});
    }

    resendChangePasswordToken(token: string) {
        this.appService.credentials = undefined;
        return this.http.get('/authentication/resendChangePasswordToken', {params: {token: token}});
    }

    resendTokenAnonymous(id: number) {
        return this.http.get(`/authentication/resendToken/${id}`);
    }

    changeNewPassword(id: number, form: { password: string; oldPassword: string; confirmPassword: string }) {
        return this.http.post(`/authentication/changeNewPassword/${id}`, form);
    }

    changePassword(id: number, form: { password: string; oldPassword: string, confirmPassword: string }) {
        this.appService.credentials = undefined;
        return this.http.post(`/authentication/changePassword/${id}`, form);
    }

    verifyPassword(credentials) {
        this.appService.credentials = undefined;
        return this.http.post( `/authentication/verifyPassword`, credentials);
    }
}
