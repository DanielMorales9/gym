import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CreateSaleComponent} from './sales';
import {AdminCalendarComponent} from './calendar';
import {SaleDetailsComponent, SalesComponent} from '../shared/sales';
import {UserControlsComponent, UserDetailsComponent, UsersComponent} from '../shared/users';
import {ACustomerCalendarComponent} from './customer-calendar';
import {BundleSpecDetailsComponent, BundleSpecsComponent} from '../shared/bundle-specs';
import {BundleDetailsComponent, BundlesCustomerComponent} from '../shared/bundles';
import {HomeComponent} from './home';
import {AuthGuardService} from '../core/guards';
import {ProfileComponent} from '../shared/profile';
import {GymSettingsComponent} from '../shared/settings';
import {CalendarControlsComponent, CalendarCustomerControlsComponent} from '../shared/calendar';

const routes = [

    { path: '', children : [
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
                data: {title: 'Dettaglio Utente', secondary: UserControlsComponent }
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
                data: {title: 'Calendario', secondary: CalendarControlsComponent }
            },
            {
                path: 'calendar/:id', component: ACustomerCalendarComponent,
                data: {title: 'Calendario Cliente', secondary: CalendarCustomerControlsComponent }
            },
            {
                path: 'profile', component: ProfileComponent,
                canActivate: [AuthGuardService],
                data: {title: 'Profilo'}
            },
            {
                path: 'settings/gym', component: GymSettingsComponent,
                canActivate: [AuthGuardService],
                data: {title: 'La mia Palestra' }
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
