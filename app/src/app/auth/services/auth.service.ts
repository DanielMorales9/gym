import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {User} from "../../shared/model";
import {AppService} from "../../app.service";

@Injectable()
export class AuthService {


    constructor(private http: HttpClient, private appService: AppService) {
    }

    getUserFromVerificationToken(token: any) {
        this.appService.credentials = undefined;
        return this.http.get("/authentication/verification",{ params: {token: token}});
    }

    verifyPassword(credentials, role) {
        this.appService.credentials = undefined;
        return this.http.post( `/authentication/${role}/verifyPassword`, credentials);
    }

    resendToken(token: string) {
        this.appService.credentials = undefined;
        return this.http.get("/authentication/resendToken", {params: {token: token}})
    }

    changePassword(user: User, userType: string) {
        this.appService.credentials = undefined;
        return this.http.post(`/authentication/${userType}/changePassword`, user);
    }

    findByEmail(email: string) {
        this.appService.credentials = undefined;
        return this.http.get(`/authentication/findByEmail?email=${email}`)
    }

    resendChangePasswordToken(token: string) {
        this.appService.credentials = undefined;
        return this.http.get("/authentication/resendChangePasswordToken", {params: {token: token}})
    }

}
