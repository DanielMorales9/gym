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
        return this.http.get('/authentication/verification', {params: {token: token}});
    }

    registration(user: User, gymId: any): Observable<Object> {
        return this.http.post(`/authentication/registration?gymId=${gymId}`, user);
    }

    resendToken(token: string) {
        this.appService.credentials = undefined;
        return this.http.get('/authentication/resendExpiredToken', {params: {token: token}});
    }

    resendTokenAnonymous(id: number) {
        return this.http.get(`/authentication/resendToken/${id}`);
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
