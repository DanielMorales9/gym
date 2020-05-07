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
});
