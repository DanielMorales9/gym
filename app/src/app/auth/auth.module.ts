import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthRouting} from "./auth.routing";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared";
import {
    SendChangePasswordTokenComponent, LoginComponent, ModifyPasswordComponent,
    VerificationComponent
} from "./components";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        AuthRouting,
    ],
    declarations: [
        LoginComponent,
        VerificationComponent,
        SendChangePasswordTokenComponent,
        ModifyPasswordComponent
    ],
})
export class AuthModule { }
