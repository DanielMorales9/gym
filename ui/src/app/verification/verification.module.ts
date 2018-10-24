import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {VerificationComponent} from "./verification.component";
import {VerificationRouting} from "./verification.routing";

@NgModule({
    imports: [
        CommonModule,
        VerificationRouting,
    ],
    declarations: [VerificationComponent]
})
export class VerificationModule { }
