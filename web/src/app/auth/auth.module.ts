import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthRouting} from './auth.routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {
    HomeComponent,
    LoginComponent,
    ModifyPasswordComponent,
    SendChangePasswordTokenComponent,
    VerificationComponent
} from './components';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        AuthRouting,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
    ],
    declarations: [
        LoginComponent,
        VerificationComponent,
        SendChangePasswordTokenComponent,
        ModifyPasswordComponent,
        HomeComponent
    ]
})
export class AuthModule { }
