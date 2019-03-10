import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    BundleDetailsComponent, NoCardComponent,
    PagerComponent,
    SaleDetailsComponent,
    SaleModalComponent, SalesComponent, SpinnerComponent,
} from "./components";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
    BundlesService,
    SalesService,
    TimesOffService,
    TrainingService, UserHelperService,
    UserService
} from "./services";
import {MatProgressSpinnerModule} from "@angular/material";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule
    ],
    declarations: [
        SalesComponent,
        SaleDetailsComponent,
        SaleModalComponent,
        NoCardComponent,
        PagerComponent,
        BundleDetailsComponent,
        SpinnerComponent],
    exports: [
        SalesComponent,
        SaleDetailsComponent,
        SaleModalComponent,
        NoCardComponent,
        PagerComponent,
        BundleDetailsComponent,
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