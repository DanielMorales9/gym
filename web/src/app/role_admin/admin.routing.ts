import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CreateSaleComponent} from './sales';
import {AdminCalendarComponent} from './calendar';
import {SaleDetailsComponent, SalesComponent} from '../shared/sales';
import {UserDetailsComponent, UsersComponent} from '../shared/users';
import {ACustomerCalendarComponent} from './customer-calendar';
import {BundleSpecDetailsComponent, BundleSpecsComponent} from '../shared/bundle-specs';
import {BundleDetailsComponent, BundlesCustomerComponent} from '../shared/bundles';
import {HomeComponent} from './home';
import {AuthGuardService} from '../core/guards';
import {ProfileComponent} from '../shared/profile';
import {GymSettingsComponent} from '../shared/settings';

const routes = [

    { path: '', children : [
            { path: '', redirectTo: 'sales', pathMatch: 'full'},
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
                data: {title: 'Pacchetti Utente' }
            },
            {
                path: 'users', component: UsersComponent,
                data: {title: 'Utenti' }
            },
            {
                path: 'users/:id', component: UserDetailsComponent,
                data: {title: 'Dettaglio Utente' }
            },
            {
                path: 'sales', component: SalesComponent,
                data: {title: 'Vendite' }
            },
            {
                path: 'sales/buy/:id', component: CreateSaleComponent,
                data: {title: 'Crea Vendita' }
            },
            {
                path: 'sales/:id', component: SaleDetailsComponent,
                data: {title: 'Dettaglio Vendita' }
            },
            {
                path: 'calendar', component: AdminCalendarComponent,
                data: {title: 'Calendario' }
            },
            {
                path: 'calendar/:id', component: ACustomerCalendarComponent,
                data: {title: 'Calendario Cliente' }
            },
            {
                path: 'profile', component: ProfileComponent,
                canActivate: [AuthGuardService],
                data: {title: 'Profilo'}
            },
            {
                path: 'settings/gym', component: GymSettingsComponent,
                canActivate: [AuthGuardService],
                data: {title: 'Impostazioni Palestra' }
            },
            {
                path: 'home', component: HomeComponent,
                data: {title: 'Home' }
            },
            { path: '**', redirectTo: 'home' }
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
export class AdminRouting { }
