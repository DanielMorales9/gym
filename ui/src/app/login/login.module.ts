import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginComponent} from "./login.component";
import {LoginRouting} from "./login.routing";
import {FormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        LoginRouting,
        FormsModule
    ],
    declarations: [
        LoginComponent
    ],
})
export class LoginModule { }
