import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChangePasswordComponent, LoginComponent, ModifyPasswordComponent, VerificationComponent} from "./components";


const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'verification', component: VerificationComponent},
    { path: 'changePassword', component: ChangePasswordComponent},
    { path: 'modifyPassword', component: ModifyPasswordComponent},
    { path: '**', redirectTo: 'login' }
];


@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AuthRouting { }
