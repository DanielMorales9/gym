import {TestBed} from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {AuthService} from "./auth.service";
import {User} from "../../shared/model";
import {AppService} from "../../app.service";

describe('AuthService', () => {

    let authService: AuthService;
    let backend: HttpTestingController;
    const email = 'giorgio@giorgio.com';

    class MockAppService {

    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers: [
                AuthService,
                {provide: AppService, useClass: MockAppService}]
        });

        // Inject the http service and test controller for each test
        authService = TestBed.get(AuthService);
        backend = TestBed.get(HttpTestingController);
    });

    describe ("testing #changePassword method", () => {
        it("it should change password", done => {
            let user = new User();
            user.email = email;
            user.password = 'giovannigiorgio';
            let userType = 'customer';
            authService.changePassword(user, userType).subscribe((res) => {
                expect(user.password).toBe(undefined);
                expect(user.email).toEqual(email);
                done()
            });

            let req = backend.expectOne({
                url: "/authentication/customer/changePassword",
                method: "POST"
            });

            user.password = undefined;
            req.flush(user)
        });
    });

    describe ("testing #getUserFromVerificationToken method", () => {
        it("it should return a user", done => {
            let token = "aaaa";
            authService.getUserFromVerificationToken(token).subscribe((res) => {
                expect(res).toEqual(new User());
                done()
            });

            let req = backend.expectOne({
                url: `/authentication/verification?token=${token}`,
                method: "GET"
            });

            req.flush(new User())
        });
    });

    describe ("testing #resendToken method", () => {
        it("it should return empty user", done => {
            let token = "aaaa";
            authService.resendToken(token).subscribe((res) => {
                expect(res).toEqual(new User());
                done()
            });

            let req = backend.expectOne({
                url: `/authentication/resendToken?token=${token}`,
                method: "GET"
            });

            req.flush(new User())
        });
    });

    describe ("testing #verifyPassword method", () => {
        it("it should return empty user", done => {
            let credentials = {username: email, password: "giovanni"};
            authService.verifyPassword(credentials, 'customer').subscribe((res) => {
                expect(res).toEqual(new User());
                done()
            });

            let req = backend.expectOne({
                url: `/authentication/customer/verifyPassword`,
                method: "POST"
            });

            req.flush(new User())
        });
    });

    describe ("testing #findByEmail method", () => {
        it("it should return User", done => {
            authService.findByEmail(email).subscribe((res) => {
                let user = new User();
                user.email = email;
                user.firstName = 'giorgio';
                expect(res).toEqual(user);
                done()
            });

            let req = backend.expectOne({
                url: `/authentication/findByEmail?email=${email}`,
                method: "GET"
            });
            let user = new User();
            user.email = email;
            user.firstName = 'giorgio';
            req.flush(user);
        });
    });

});