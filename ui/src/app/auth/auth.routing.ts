import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent, VerificationComponent} from "./components";


const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'verification', component: VerificationComponent},
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
