import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthRouting} from "./auth.routing";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared";
import {LoginComponent, VerificationComponent} from "./components";
@NgModule({
    imports: [
        CommonModule,
        AuthRouting,
        SharedModule,
        FormsModule
    ],
    declarations: [
        LoginComponent,
        VerificationComponent
    ],
})
export class AuthModule { }
