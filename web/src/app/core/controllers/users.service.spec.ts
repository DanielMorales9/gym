import {TestBed} from '@angular/core/testing';
import {UserService} from './users.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpErrorResponse} from '@angular/common/http';
import {User} from '../../shared/model';

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

    it('testing #findByEmail', async done => {
        const promise = userService.findByEmail('admin');
        const req = backend.expectOne({
            url: '/users/findByEmail?email=admin',
            method: 'GET'
        });
        req.flush({});
        const [data, error] = await promise;
        expect(data).toEqual({});
        done();
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

    it('testing #patch', async done => {
        const user = new User();
        user.id = 1;
        const promise = userService.patch(user);
        const req = backend.expectOne({
            url: '/users/1',
            method: 'PATCH'
        });
        user.firstName = 'Daniel';
        req.flush(user);
        const [res, error] = await promise;
        expect(res).toEqual(user);
        done();
    });

    describe ('testing #findUserById', () => {
        it('it should return an empty user', async done => {
            const promise = userService.findById(1);
            const req = backend.expectOne({
                url: '/users/1',
                method: 'GET'
            });
            req.flush({});
            const [res, error] = await promise;
            expect(res).toEqual({});
            done();
        });

        it('it should return a 404 error', async done => {
            const emsg = 'deliberate 404 error';
            const promise = userService.findById(1);
            const req = backend.expectOne({
                url: '/users/1',
                method: 'GET'
            });

            req.flush(emsg, { status: 404, statusText: 'Not Found' });

            const [data, error] = await promise;
            expect(error.status).toEqual(404, 'status');
            expect(error.error).toEqual(emsg, 'message');
            done();
        });
    });




});
