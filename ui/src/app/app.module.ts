import { BrowserModule } from '@angular/platform-browser';
import {Injectable, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import localeIt from '@angular/common/locales/it';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgbModalModule} from "@ng-bootstrap/ng-bootstrap";
import {LoginComponent} from "./login.component";
import {VerificationComponent} from "./verify.component";
import {ErrorComponent} from "./error.component";
import {HomeComponent} from "./home/home.component";
import {SalesComponent} from "./sales/sales.component";
import {UsersComponent} from "./users/users.component";
import {BundlesComponent} from "./bundles/bundles.component";
import {BookingComponent} from "./booking/booking.component";
import {SingleUserComponent} from "./users/user-single.component";
import {UserProfileComponent} from "./users/user-profile.component";
import {MakeSaleComponent} from "./sales/sale-make.component";
import {SaleSummaryComponent} from "./sales/sale-summary.component";
import {AppComponent} from "./app.component";
import {BundleModalComponent} from "./bundles/bundle-modal.component";
import {BundleDetailsComponent} from "./bundles/bundle-details.component";
import {UserModalComponent} from "./users/user-modal.component";
import {UserDetailsComponent} from "./users/user-details.component";
import {SaleDetailsComponent} from "./sales/sale-details.component";
import {SaleModalComponent} from "./sales/sale-modal.component";
import {CalendarModule, DateAdapter} from "angular-calendar";
import {BundlesService} from "./services/bundles.service";
import {MessageService} from "./services/message.service";
import {ChangeViewService} from "./services/change-view.service";
import {SalesService} from "./services/sales.service";
import {ExchangeUserService} from "./services/exchange-user.service";
import {ExchangeSaleService} from "./services/exchange-sale.service";
import {ExchangeBundleService} from "./services/exchange-bundle.service";
import {UserService} from "./services/users.service";
import {EqualValidator} from "./utils/equal-validator.directive";
import {PagerComponent} from "./utils/pager.component";
import {NumberValidator} from "./utils/number-validator.directive";
import {AppService} from "./services/app.service";
import {TrainingService} from "./services/training.service";
import {TrainingComponent} from "./training/training.component";
import {TrainingDetailsComponent} from "./training/training-details.component";
import {registerLocaleData} from "@angular/common";

registerLocaleData(localeIt);

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home'},
    { path: 'login', component: LoginComponent},
    { path: 'verification', component: VerificationComponent},
    { path: 'error', component: ErrorComponent},
    { path: 'home',
        component: HomeComponent,
        children: [
            { path: '', redirectTo: 'booking' , pathMatch: "full"},
            { path: 'users', component: UsersComponent },
            { path: 'sales', component: SalesComponent },
            { path: 'bundles', component: BundlesComponent},
            { path: 'booking', component: BookingComponent}
        ]
    },
    { path: 'user/:id?', component: SingleUserComponent,
        children: [
            { path: '', redirectTo: 'profile', pathMatch: "full" },
            { path: 'profile', component: UserProfileComponent },
            { path: 'makeSale', component: MakeSaleComponent },
            { path: 'sales', component: SalesComponent },
            { path: 'summarySale/:saleId', component: SaleSummaryComponent },
            { path: 'trainings', component: TrainingComponent },
        ]
    }
];

@Injectable()
export class XhrInterceptor implements HttpInterceptor {

    constructor(private app: AppService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const xhr = req.clone({
            url: "/api" + req.url,
            setHeaders: {
                'X-Requested-With': 'XMLHttpRequest',
                'authorization': this.app.getAuthorizationHeader()
            }
        });

        return next.handle(xhr);
    }
}

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        UserProfileComponent,
        LoginComponent,
        SalesComponent,
        BundleModalComponent,
        BundleDetailsComponent,
        SaleSummaryComponent,
        BundlesComponent,
        SingleUserComponent,
        UserModalComponent,
        UserDetailsComponent,
        UsersComponent,
        SaleDetailsComponent,
        PagerComponent,
        VerificationComponent,
        ErrorComponent,
        SaleModalComponent,
        TrainingComponent,
        EqualValidator,
        NumberValidator,
        TrainingDetailsComponent,
        MakeSaleComponent,
        BookingComponent
    ],
    imports: [
        RouterModule.forRoot(routes),
        BrowserModule,
        NgbModalModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        })
    ],
    providers: [
        AppService,
        BundlesService,
        MessageService,
        TrainingService,
        ChangeViewService,
        SalesService,
        ExchangeUserService,
        ExchangeSaleService,
        ExchangeBundleService,
        UserService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: XhrInterceptor,
            multi: true
        }],
    bootstrap: [AppComponent]
})
export class AppModule { }

