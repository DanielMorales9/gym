import {TestBed} from '@angular/core/testing';
import {UserService} from './users.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpErrorResponse} from '@angular/common/http';
import {User} from '../model';

describe('UserService', () => {

    let userService: UserService;
    let backend: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers: [UserService]
        });

        // Inject the http service and test controller for each test
        userService = TestBed.get(UserService);
        backend = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        backend.verify();
    });

    it('testing #findByEmail', done => {
        userService.findByEmail('admin').subscribe(res => {
            expect(res).toEqual({});
            done();
        });
        const req = backend.expectOne({
            url: '/users/findByEmail?email=admin',
            method: 'GET'
        });
        req.flush({});
    });

    it('testing #getRoles', done => {
        userService.getRoles(1).subscribe(res => {
            expect(res).toEqual([]);
            done();
        });
        const req = backend.expectOne({
            url: '/users/1/roles',
            method: 'GET'
        });
        req.flush([]);
    });

    it('testing #get', done => {
        userService.get(1, 5).subscribe(res => {
            expect(res).toEqual([user]);
            done();
        });
        const req = backend.expectOne({
            url: '/users?page=1&size=5&sort=lastName',
            method: 'GET'
        });
        const user = new User();
        user.id = 1;
        user.createdAt = 'now';
        req.flush([user]);
    });

    it('testing #search', done => {
        userService.search('Rossi', 1, 5).subscribe(res => {
            expect(res).toEqual([user]);
            done();
        });
        const req = backend.expectOne({
            url: '/users/search?query=Rossi&page=1&size=5&sort=lastName',
            method: 'GET'
        });
        const user = new User();
        user.id = 1;
        user.createdAt = 'now';
        req.flush([user]);
    });

    it('testing #patch', done => {
        const user = new User();
        user.id = 1;
        userService.patch(user).subscribe(res => {
            expect(res).toEqual(user);
            done();
        });
        const req = backend.expectOne({
            url: '/users/1',
            method: 'PATCH'
        });
        user.firstName = 'Daniel';
        req.flush(user);
    });

    it('testing #getCurrentTrainingBundles', done => {
        const user = new User();
        user.id = 1;
        userService.getCurrentTrainingBundles(user.id).subscribe(res => {
            expect(res).toEqual([]);
            done();
        });
        const req = backend.expectOne({
            url: '/customers/1/currentTrainingBundles',
            method: 'GET'
        });
        req.flush([]);
    });

    describe ('testing #findUserById', () => {
        it('it should return an empty user', done => {
            userService.findById(1).subscribe(res => {
                expect(res).toEqual({});
                done();
            });
            const req = backend.expectOne({
                url: '/users/1',
                method: 'GET'
            });
            req.flush({});
        });
        it('it should return a 404 error', done => {
            const emsg = 'deliberate 404 error';

            userService.findById(1).subscribe(data =>
                    fail('should have failed with the 404 error'),
                (error: HttpErrorResponse) => {
                    expect(error.status).toEqual(404, 'status');
                    expect(error.error).toEqual(emsg, 'message');
                    done();
                });
            const req = backend.expectOne({
                url: '/users/1',
                method: 'GET'
            });
            req.flush(emsg, { status: 404, statusText: 'Not Found' });
        });
    });




});
