import {TestBed} from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {AppService} from "./app.service";
import {UserHelperService, UserService} from "./shared/services";
import {Role, User} from "./shared/model";
import {ChangeViewService, NotificationService} from "./services";

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
                console.log(err);
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


});