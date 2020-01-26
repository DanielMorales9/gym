import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthRouting} from './auth.routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {LoginComponent, ModifyPasswordComponent, SendChangePasswordTokenComponent, VerificationComponent} from './components';
import {MatFormFieldModule, MatInputModule} from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        AuthRouting,
        MatFormFieldModule,
        MatInputModule,
    ],
    declarations: [
        LoginComponent,
        VerificationComponent,
        SendChangePasswordTokenComponent,
        ModifyPasswordComponent
    ]
})
export class AuthModule { }
