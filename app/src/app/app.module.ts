import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgbModalModule} from "@ng-bootstrap/ng-bootstrap";
import {AppComponent} from "./app.component";
import {AppRouting} from "./app.routing";
import {SharedModule} from "./shared";
import {CoreModule} from "./core";
import {
    AppService,
    AuthenticatedService,
    AuthService,
    ChangeViewService,
    DateService,
    ExchangeBundleService,
    ExchangeSaleService,
    ExchangeUserService,
    GlobalErrorHandler,
    GymConfigurationService,
    NotificationService,
    SaleHelperService
} from "./services";
import {ErrorComponent, NotificationsComponent} from "./components";
import {TimeAgoPipe} from "time-ago-pipe";
import {MatIconModule, MatListModule, MatSidenavModule, MatToolbarModule} from '@angular/material';
import {RoleGuardService} from "./services/role.guard.service";
import {AuthGuardService} from "./services/auth.guard.service";

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
        MatSidenavModule,
        MatIconModule,
        MatToolbarModule,
        MatListModule
    ],
    providers: [
        AppService,
        AuthService,
        AuthenticatedService,
        AuthGuardService,
        RoleGuardService,
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

