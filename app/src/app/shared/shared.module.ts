import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    BundleDetailsComponent, NoCardComponent,
    PagerComponent,
    SaleDetailsComponent,
    SaleModalComponent, SalesComponent, SpinnerComponent,
    UserModalComponent
} from "./components";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {EqualValidator, NumberValidator} from "./directives";
import {
    BundlesService,
    ChangeViewService,
    ExchangeBundleService, ExchangeSaleService,
    ExchangeUserService,
    NotificationService, SalesService,
    TimesOffService,
    TrainingService, UserHelperService,
    UserService
} from "./services";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        SalesComponent,
        SaleDetailsComponent,
        SaleModalComponent,
        UserModalComponent,
        NoCardComponent,
        PagerComponent,
        BundleDetailsComponent,
        NumberValidator,
        EqualValidator,
        SpinnerComponent
    ],
    exports: [
        SalesComponent,
        SaleDetailsComponent,
        SaleModalComponent,
        NoCardComponent,
        UserModalComponent,
        PagerComponent,
        BundleDetailsComponent,
        NumberValidator,
        EqualValidator,
        SpinnerComponent
    ],
    providers: [
        SalesService,
        BundlesService,
        UserHelperService,
        ChangeViewService,
        ExchangeSaleService,
        ExchangeBundleService,
        ExchangeUserService,
        NotificationService,
        TimesOffService,
        TrainingService,
        UserService,
    ]
})
export class SharedModule { }
