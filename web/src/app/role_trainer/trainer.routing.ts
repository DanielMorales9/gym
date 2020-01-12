import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TrainerCalendarComponent} from './calendar';
import {UserDetailsComponent, UsersComponent} from '../shared/components/users';
import {BundleDetailsComponent} from '../shared/components/bundles';
import {BundleSpecDetailsComponent} from '../shared/components/bundle-specs';

const routes = [
    { path: '', children : [
            { path: '', redirectTo: 'calendar', pathMatch: 'full'},
            { path: 'calendar', component: TrainerCalendarComponent },
            { path: 'users', component: UsersComponent },
            { path: 'users/:id', component: UserDetailsComponent},
            { path: 'bundleSpecs/:id', component: BundleSpecDetailsComponent },
            { path: 'bundles/:id', component: BundleDetailsComponent },
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
