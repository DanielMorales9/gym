import { BrowserModule } from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgbModalModule} from "@ng-bootstrap/ng-bootstrap";
import {AppComponent} from "./app.component";
import {AppRouting} from "./app.routing";
import {SharedModule} from "./shared";
import {CoreModule} from "./core";
import {
    AppService,
    AuthService,
    ExchangeBundleService,
    ExchangeSaleService,
    ExchangeUserService, GlobalErrorHandler,
    GymConfigurationService
} from "./services";
import {
    ChangeViewService,
    DateService,
    NotificationService, SaleHelperService,
} from "./services";
import {ErrorComponent, NotificationsComponent} from "./components";
import {TimeAgoPipe} from "time-ago-pipe";

@NgModule({
    declarations: [
        AppComponent,
        ErrorComponent,
        NotificationsComponent,
        TimeAgoPipe
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
        AuthService,
        ChangeViewService,
        NotificationService,
        SaleHelperService,
        GymConfigurationService,
        DateService,
        ExchangeUserService,
        ExchangeBundleService,
        ExchangeSaleService,
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

