import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TrainerCalendarComponent} from './calendar';
import {UserDetailsComponent, UsersComponent} from '../shared/users';
import {BundleDetailsComponent, BundlesCustomerComponent} from '../shared/bundles';
import {BundleSpecDetailsComponent, BundleSpecsComponent} from '../shared/bundle-specs';

const routes = [
    { path: '', children : [
            { path: '', redirectTo: 'calendar', pathMatch: 'full'},
            {
                path: 'calendar', component: TrainerCalendarComponent,
                data: {title: 'Calendario' }
            },
            {
                path: 'users', component: UsersComponent,
                data: {title: 'Utenti' }
            },
            {
                path: 'users/:id', component: UserDetailsComponent,
                data: {title: 'Scheda Cliente' }
            },
            {
                path: 'bundleSpecs', component: BundleSpecsComponent,
                data: {title: 'Tipi Pacchetti' }
            },
            {
                path: 'bundleSpecs/:id', component: BundleSpecDetailsComponent,
                data: {title: 'Dettaglio Tipo Pacchetto' }
            },
            {
                path: 'bundles/:id', component: BundleDetailsComponent,
                data: {title: 'Dettaglio Pacchetto' }
            },
            {
                path: 'customer/bundles', component: BundlesCustomerComponent,
                data: {title: 'Pacchetti Cliente' }
            },
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
