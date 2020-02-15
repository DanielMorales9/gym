import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
    HomeComponent,
    LoginComponent,
    ModifyPasswordComponent,
    SendChangePasswordTokenComponent,
    VerificationComponent
} from './components';


const routes: Routes = [
    { path: 'login', component: LoginComponent, data: {title: 'Login'} },
    { path: 'verification', component: VerificationComponent},
    { path: 'sendChangePasswordToken', data: {title: 'Resetta password', back: true}, component: SendChangePasswordTokenComponent},
    { path: 'modifyPassword', component: ModifyPasswordComponent, data: {title: 'Modifica password', back: true}},
    { path: 'home', component: HomeComponent, data: {title: 'Benvenuto'}},
    { path: '**', redirectTo: 'home' }
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
