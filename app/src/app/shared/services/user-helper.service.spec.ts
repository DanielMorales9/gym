import {fakeAsync, inject, TestBed} from "@angular/core/testing";
import {UserService} from "./users.service";
import {Role, User} from "../model";
import {UserHelperService} from "./user-helper.service";
import {Injectable} from "@angular/core";
import {Observable, of} from 'rxjs';

@Injectable()
export class MockUserService extends UserService {

    getRoles(id: number): Observable<Object> {
        return of({_embedded: [ { name: 'ADMIN' }, { name: 'TRAINER'}, {name: 'CUSTOMER'}]});
    }

}


describe('UserHelperService', () => {

    let userHelperService: UserHelperService;


    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [UserHelperService, {provide: UserService, useValue: MockUserService}]
        });

        userHelperService = TestBed.get(UserHelperService);
    });

    describe('test #getRoles method', () => {
        it('it should return array of roles', fakeAsync(() => {
            inject([UserService], (injectService: UserService) => {
                userHelperService.getRoles(1, (roles: Role[]) => {
                    console.log(roles);
                    expect(roles).toEqual([
                        new Role(1, 'ADMIN'),
                        new Role(2, "TRAINER"),
                        new Role(3, "CUSTOMER")]);
                })
            })
        }))
    })
});