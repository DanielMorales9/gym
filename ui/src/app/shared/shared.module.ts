import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PagerComponent} from "./pager.component";
import {NumberValidator} from "./number-validator.directive";
import {EqualValidator} from "./equal-validator.directive";
import {CoreModule} from "../core/core.module";
import {SalesComponent} from "./sales/sales.component";
import {SaleDetailsComponent} from "./sales/sale-details.component";
import {SaleModalComponent} from "./sales/sale-modal.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserModalComponent} from "./users/user-modal.component";
import {BundleDetailsComponent} from "./bundles/bundle-details.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule
    ],
    declarations: [
        SalesComponent,
        SaleDetailsComponent,
        SaleModalComponent,
        UserModalComponent,
        PagerComponent,
        BundleDetailsComponent,
        NumberValidator,
        EqualValidator
    ],
    exports: [
        SalesComponent,
        SaleDetailsComponent,
        SaleModalComponent,
        UserModalComponent,
        PagerComponent,
        BundleDetailsComponent,
        NumberValidator,
        EqualValidator
    ]
})
export class SharedModule { }
