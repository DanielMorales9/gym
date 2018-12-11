import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    BundleDetailsComponent, NoCardComponent,
    PagerComponent,
    SaleDetailsComponent,
    SaleModalComponent, SalesComponent, SpinnerComponent,
} from "./components";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {EqualValidator, NumberValidator} from "./directives";
import {
    BundlesService,
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
        PagerComponent,
        BundleDetailsComponent,
        NumberValidator,
        EqualValidator,
        SpinnerComponent
    ],
    providers: [
        BundlesService,
        SalesService,
        TimesOffService,
        TrainingService,
        UserService,
        UserHelperService
    ]

})
export class SharedModule {

}