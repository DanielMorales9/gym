import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TrainerCalendarComponent} from './calendar';
import {UserDetailsComponent, UsersComponent} from '../shared/components/users';
import {BundleDetailsComponent, BundlesComponent, BundlesCustomerComponent} from '../shared/components/bundles';
import {BundleSpecDetailsComponent, BundleSpecsComponent} from '../shared/components/bundle-specs';

const routes = [
    { path: '', children : [
            { path: '', redirectTo: 'calendar', pathMatch: 'full'},
            { path: 'calendar', component: TrainerCalendarComponent },
            { path: 'users', component: UsersComponent },
            { path: 'users/:id', component: UserDetailsComponent},
            { path: 'bundleSpecs', component: BundleSpecsComponent },
            { path: 'bundleSpecs/:id', component: BundleSpecDetailsComponent },
            { path: 'bundles', component: BundlesComponent },
            { path: 'bundles/:id', component: BundleDetailsComponent },
            { path: 'customer/bundles', component: BundlesCustomerComponent },
            { path: '**', redirectTo: 'calendar' }
        ]},
];
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class TrainerRouting { }