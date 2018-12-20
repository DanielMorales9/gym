import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {AppService} from "../../services/app.service";

import {RouterTestingModule} from "@angular/router/testing";
import {By} from "@angular/platform-browser";
import {DebugElement} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {UsersComponent} from "./users.component";
import {User} from "../../shared/model";
import {UserService} from "../../shared/services";
import {UserDetailsComponent} from "./user-details.component";
import {PagerComponent} from "../../shared/components";

describe('UsersComponent', () => {

    let fixture: ComponentFixture<UsersComponent>;
    let submitEl: DebugElement;
    let usersComponent: UsersComponent;

    class MockUserService extends UserService {

    }

    class MockAppService extends AppService {

    }

    // beforeEach(() => {
    //     TestBed.configureTestingModule({
    //         declarations: [ UsersComponent, UserDetailsComponent, PagerComponent ],
    //         imports: [
    //             FormsModule,
    //         ],
    //         providers: [
    //             {provide: UserService, useValue: MockUserService},
    //             {provide: AppService, useValue: MockAppService}
    //         ]
    //     });
    //
    //     fixture = TestBed.createComponent(UsersComponent);
    //     usersComponent = fixture.componentInstance;
    //
    // });
    //
    //
    // describe("test #getUsersByPage method", () => {
    //     it("it should return users", event => {
    //         usersComponent.getUsersByPage();
    //
    //     });
    // });

});