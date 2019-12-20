import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent, ModifyPasswordComponent, SendChangePasswordTokenComponent, VerificationComponent} from './components';
import {NoAuthGuardService} from '../core/guards';


const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'verification', component: VerificationComponent, canActivate: [NoAuthGuardService]},
    { path: 'sendChangePasswordToken', component: SendChangePasswordTokenComponent, canActivate: [NoAuthGuardService]},
    { path: 'modifyPassword', component: ModifyPasswordComponent, canActivate: [NoAuthGuardService]},
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
