import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ErrorComponent, GymSettingsComponent, ProfileComponent} from './components';
import {RoleGuardService} from './core/guards';
import {AuthGuardService} from './core/guards';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home'},

    { path: 'error', component: ErrorComponent },
    { path: 'auth', loadChildren: 'app/auth/auth.module#AuthModule'},
    { path: 'home', loadChildren: 'app/home/home.module#HomeModule' },

    { path: 'profile', component: ProfileComponent,
        canActivate: [AuthGuardService]
    },
    { path: 'settings/gym', component: GymSettingsComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'admin', loadChildren: 'app/role_admin/admin.module#AdminModule',
        canActivate: [RoleGuardService],
        data: {
            expectedRole: 'A'
        }
    },
    {
        path: 'trainer', loadChildren: 'app/role_trainer/trainer.module#TrainerModule',
        canActivate: [RoleGuardService],
        data: {
            expectedRole: 'T'
        }
    },
    {
        path: 'customer', loadChildren: 'app/role_customer/customer.module#CustomerModule',
        canActivate: [RoleGuardService],
        data: {
            expectedRole: 'C'
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
