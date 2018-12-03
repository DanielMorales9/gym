import {TestBed} from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {AppService} from "./app.service";
import {NotificationService, UserHelperService, UserService} from "./shared/services";
import {Role, User} from "./shared/model";
import {ChangeViewService} from "./services";

describe('AppService', () => {

    let appService: AppService;
    let backend: HttpTestingController;
    const email = 'giorgio@giorgio.com';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers: [
                UserService,
                UserHelperService,
                NotificationService,
                ChangeViewService
            ]
        });

        // Inject the http service and test controller for each test
        appService = TestBed.get(AppService);
        backend = TestBed.get(HttpTestingController);
    });

    describe ("testing #changePassword method", () => {
        it("it should change password", done => {
            let user = new User();
            user.email = email;
            user.password = 'giovannigiorgio';
            let userType = 'customer';
            appService.changePassword(user, userType).subscribe((res) => {
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

    describe ("testing #getAuthorizationHeader method", () => {
        it("it should return Basic header", done => {
            appService.credentials = {username: 'email', password: 'password'};
            let header = appService.getAuthorizationHeader();
            expect(header).not.toEqual('Basic ');
            done()
        });
        it("it should return Empty Header", done => {
            let header = appService.getAuthorizationHeader();
            expect(header).toEqual('Basic ');
            done()
        });
    });


    describe ("testing #getUserFromVerificationToken method", () => {
        it("it should return a user", done => {
            let token = "aaaa";
            appService.getUserFromVerificationToken(token).subscribe((res) => {
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
            appService.resendToken(token).subscribe((res) => {
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

    describe ("testing #logout method", () => {
        it("it should return nothing", done => {
            appService.logout(() => {
                expect(appService.authenticated).toBe(false);
                done()
            });

            let req = backend.expectOne({
                url: `/logout`,
                method: "GET"
            });

            req.flush(null, {status: 200, statusText: "OK"})
        });
    });

    describe ("testing #verifyPassword method", () => {
        it("it should return empty user", done => {
            let credentials = {username: email, password: "giovanni"};
            appService.verifyPassword(credentials, 'customer').subscribe((res) => {
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
            appService.findByEmail(email).subscribe((res) => {
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

    describe ("testing #discardSession method", () => {
        it("it should discard session", done => {
            appService.discardSession();
            expect(appService.credentials).toEqual({});
            expect(appService.user).toEqual(new User());
            done()
        });
    });

    describe ("testing #authenticate method", () => {
        let email = 'giorgio@giorgio.com';
        let credentials = {username: email, password: 'password'};
        it("it should authenticate", done => {
            let credentials = {username: email, password: 'password'};
            appService.authenticate(credentials, (res) => {
                expect(res).toBe(true);
                expect(appService.user).not.toBe(undefined);
                let role = new Role(1, "ADMIN");
                role.id = 3;
                role.name = "CUSTOMER";

                let user = new User();
                user.email = email;
                user.roles = [role];

                expect(appService.user).toEqual(user);
                expect(appService.current_role_view).toBe(3);
                done();

            }, undefined);

            let req = backend.expectOne({
                url: "/user",
                method: "GET",

            });

            let flushUser = {
                name: email,
                authorities: [{
                    authority: "CUSTOMER"
                }],
                principal: {
                    username: email
                }
            };
            req.flush(flushUser);
        });
        it("it should return an error", done => {
            appService.authenticate(credentials, undefined, (err)=> {
                expect(err.status).toEqual(401);
                done();
            });
            let req = backend.expectOne({
                url: "/user",
                method: "GET"
            });
            req.flush(null, { status: 401, statusText: 'Unauthorized'})
        })
    });

});