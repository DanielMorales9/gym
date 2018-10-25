import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BundleDetailsComponent} from "./bundle-details.component";
import {PagerComponent} from "./pager.component";
import {NumberValidator} from "./number-validator.directive";
import {EqualValidator} from "./equal-validator.directive";
import {CoreModule} from "../core/core.module";

@NgModule({
    imports: [
        CommonModule,
        CoreModule
    ],
    declarations: [
        PagerComponent,
        BundleDetailsComponent,
        NumberValidator,
        EqualValidator
    ],
    exports: [
        PagerComponent,
        BundleDetailsComponent,
        NumberValidator,
        EqualValidator
    ]
})
export class SharedModule { }
