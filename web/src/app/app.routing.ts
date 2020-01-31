import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {
    ErrorComponent,
    PrimaryAdminControlsComponent,
    PrimaryCustomerControlsComponent,
    PrimaryTrainerControlsComponent
} from './components';
import {RoleGuardService} from './core/guards';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home'},

    { path: 'error', component: ErrorComponent },
    { path: 'auth', loadChildren: () => import('app/auth/auth.module').then(m => m.AuthModule) },
    { path: 'home', loadChildren: () => import('app/home/home.module').then(m => m.HomeModule) },
    {
        path: 'admin', loadChildren: () => import('app/role_admin/admin.module').then(m => m.AdminModule),
        canActivate: [RoleGuardService],
        data: {
            expectedRole: 'A',
            primary: PrimaryAdminControlsComponent
        }
    },
    {
        path: 'trainer', loadChildren: () => import('app/role_trainer/trainer.module').then(m => m.TrainerModule),
        canActivate: [RoleGuardService],
        data: {
            expectedRole: 'T',
            primary: PrimaryTrainerControlsComponent
        }
    },
    {
        path: 'customer', loadChildren: () => import('app/role_customer/customer.module').then(m => m.CustomerModule),
        canActivate: [RoleGuardService],
        data: {
            expectedRole: 'C',
            primary: PrimaryCustomerControlsComponent
        }
    },
    { path: '**', redirectTo: 'home' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class AppRouting { }
