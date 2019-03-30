import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {User} from "../shared/model";
import {AppService} from "./app.service";
import {Observable} from "rxjs";

@Injectable()
export class AuthService {


    constructor(private http: HttpClient, private appService: AppService) {
    }

    getUserFromVerificationToken(token: any) {
        this.appService.credentials = undefined;
        return this.http.get("/authentication/verification",{ params: {token: token}});
    }

    verifyPassword(credentials) {
        this.appService.credentials = undefined;
        return this.http.post( `/authentication/verifyPassword`, credentials);
    }

    registration(user: User): Observable<Object> {
        return this.http.post( `/authentication/registration`, user);
    }


    resendToken(token: string) {
        this.appService.credentials = undefined;
        return this.http.get("/authentication/resendToken", {params: {token: token}})
    }

    changePassword(user: User) {
        this.appService.credentials = undefined;
        return this.http.post(`/authentication/changePassword`, user);
    }

    findByEmail(email: string) {
        this.appService.credentials = undefined;
        return this.http.get(`/authentication/findByEmail?email=${email}`)
    }

    resendChangePasswordToken(token: string) {
        this.appService.credentials = undefined;
        return this.http.get("/authentication/resendChangePasswordToken", {params: {token: token}})
    }

    resendTokenAnonymous(id: number) {
        return this.http.get(`/authentication/resendToken/${id}`)
    }

    changeNewPassword(id: number, model: { password: string; oldPassword: string; confirmPassword: string }) {
        return this.http.post(`/authentication/changeNewPassword/${id}`, model);
    }
}
