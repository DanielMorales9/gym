import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ErrorComponent, GymSettingsComponent, ProfileComponent} from './components';
import {RoleGuardService} from './services/role.guard.service';
import {AuthGuardService} from './services/auth.guard.service';

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
        path: 'admin', loadChildren: 'app/roles/admin/admin.module#AdminModule',
        canActivate: [RoleGuardService],
        data: {
            expectedRole: 'A'
        }
    },
    {
        path: 'trainer', loadChildren: 'app/roles/trainer/trainer.module#TrainerModule',
        canActivate: [RoleGuardService],
        data: {
            expectedRole: 'T'
        }
    },
    {
        path: 'customer', loadChildren: 'app/roles/customer/customer.module#CustomerModule',
        canActivate: [RoleGuardService],
        data: {
            expectedRole: 'C'
        }
    },
    // {
    //     path: 'profile/:id?', loadChildren: "app/profile/profile.module#ProfileModule",
    //     canActivate: [AuthGuardService]
    // },
    { path: '**', redirectTo: 'home' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class AppRouting { }
