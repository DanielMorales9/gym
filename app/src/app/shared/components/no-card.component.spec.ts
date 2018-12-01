import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {NoCardComponent} from "./no-card.component";
import {By} from "@angular/platform-browser";
import {DebugElement} from "@angular/core";

describe('NoCardComponent', () => {

    let fixture: ComponentFixture<NoCardComponent>;
    let noCardComponent: NoCardComponent;
    let spanEl: DebugElement;


    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ NoCardComponent ],
        });

        fixture = TestBed.createComponent(NoCardComponent);
        noCardComponent = fixture.componentInstance;
        spanEl = fixture.debugElement.query(By.css('span'));

    });


    describe("test input message", () => {
        it("it should set message input", done => {
            noCardComponent.message = 'test input';
            fixture.detectChanges();
            expect(spanEl.nativeElement.innerText.trim()).toEqual('test input');
            done()
        });
    });

});