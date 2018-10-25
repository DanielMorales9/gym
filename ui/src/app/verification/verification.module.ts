import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {VerificationComponent} from "./verification.component";
import {VerificationRouting} from "./verification.routing";
import {FormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        VerificationRouting,
    ],
    declarations: [VerificationComponent]
})
export class VerificationModule { }
