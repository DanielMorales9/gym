import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {User} from "../../shared/model";

@Injectable()
export class AuthService {


    constructor(private http: HttpClient) {
    }

    getUserFromVerificationToken(token: any) {
        return this.http.get("/authentication/verification",{ params: {token: token}});
    }

    verifyPassword(credentials, role) {
        return this.http.post( `/authentication/${role}/verifyPassword`, credentials);
    }

    resendToken(token: string) {
        return this.http.get("/authentication/resendToken", {params: {token: token}})
    }

    changePassword(user: User, userType: string) {
        return this.http.post(`/authentication/${userType}/changePassword`, user);
    }

    findByEmail(email: string) {
        return this.http.get(`/authentication/findByEmail?email=${email}`)
    }

    resendChangePasswordToken(token: string) {
        return this.http.get("/authentication/resendChangePasswordToken", {params: {token: token}})
    }

}
