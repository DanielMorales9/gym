import { BrowserModule } from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgbModalModule} from "@ng-bootstrap/ng-bootstrap";
import {AppComponent} from "./app.component";
import {AppRouting} from "./app.routing";
import {SharedModule} from "./shared";
import {CoreModule} from "./core";
import {AppService} from "./app.service";
import {
    ChangeViewService,
    DateService,
    NotificationService, SaleHelperService,
} from "./services";

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        NgbModalModule,
        BrowserAnimationsModule,
        CoreModule,
        SharedModule,
        AppRouting,
    ],
    providers: [
        AppService,
        ChangeViewService,
        NotificationService,
        SaleHelperService,
        DateService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

