import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {HttpClientTestingModule } from "@angular/common/http/testing";
import {AppService} from "../../app.service";
import {LoginComponent} from "./login.component";
import {RouterTestingModule} from "@angular/router/testing";
import {By} from "@angular/platform-browser";
import {DebugElement} from "@angular/core";
import {FormsModule} from "@angular/forms";

describe('LoginComponent', () => {

    let fixture: ComponentFixture<LoginComponent>;
    let submitEl: DebugElement;
    let loginComponent: LoginComponent;

    class MockAppService extends AppService {
        authenticate(credentials, callback, errorCallback) {
            return !!callback && callback();
        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ LoginComponent ],
            imports: [
                RouterTestingModule,
                HttpClientTestingModule,
                FormsModule
            ],
            providers: [
                {provide: AppService, useValue: MockAppService},
            ]
        });

        fixture = TestBed.createComponent(LoginComponent);
        submitEl = fixture.debugElement.query(By.css('button'));
        loginComponent = fixture.componentInstance;

    });


    describe("test #login method", () => {
        it("it should call login", async(() => {
            spyOn(loginComponent, 'login');
            submitEl.nativeElement.click();
            fixture.detectChanges(); // trigger ngOnInit here
            fixture.whenStable().then(() => {
                expect(loginComponent.login).toHaveBeenCalled();
                expect(loginComponent.error).toBe(false);
            });
        }));
    });

});