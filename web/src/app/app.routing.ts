import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {
    ErrorComponent,
    PrimaryAdminControlsComponent,
    PrimaryCustomerControlsComponent,
    PrimaryTrainerControlsComponent
} from './components';
import {NoAuthGuardService, RoleGuardService} from './core/guards';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home'},

    { path: 'error', component: ErrorComponent, data: { title: 'Errore', back: true } },
    { path: 'auth', loadChildren: () => import('app/auth/auth.module').then(m => m.AuthModule),
        canActivate: [NoAuthGuardService] },
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
    { path: '**', redirectTo: 'auth' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: true })],
    exports: [RouterModule],
    providers: []
})
export class AppRouting { }
