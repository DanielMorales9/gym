import {ModuleWithProviders, NgModule} from '@angular/core';
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
    ExchangeBundleService,
    ExchangeSaleService,
    ExchangeUserService,
    SalesService,
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
        SpinnerComponent],
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
        BundlesService,
        SalesService,
        ExchangeSaleService,
        UserHelperService,
        ExchangeBundleService,
        ExchangeUserService,
        TimesOffService,
        TrainingService,
        UserService
    ]

})
export class SharedModule {

}