import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CustomerCalendarComponent} from './calendar';
import {SaleDetailsComponent, SalesComponent} from '../shared/sales';
import {BundleSpecDetailsComponent} from '../shared/bundle-specs';
import {BundleDetailsComponent, BundlesCustomerComponent} from '../shared/bundles';
import {HomeComponent} from './home';
import {AuthGuardService} from '../core/guards';
import {ProfileComponent} from '../shared/profile';
import {GymSettingsComponent} from '../shared/settings';
import {CalendarControlsComponent} from '../shared/calendar';
import {EventDetailsComponent} from '../shared/events';
import {CustomerStatsComponent} from '../shared/stats';

const routes = [
    { path: '', children : [
            {
                path: 'calendar', component: CustomerCalendarComponent,
                data: {title: 'Calendario', secondary: CalendarControlsComponent  }
            },
            {
                path: 'sales', component: SalesComponent,
                data: {title: 'Ordini'}
            },
            {
                path: 'sales/:id', component: SaleDetailsComponent,
                data: {title: 'Dettaglio Vendita', back: true }
            },
            {
                path: 'bundleSpecs/:id', component: BundleSpecDetailsComponent,
                data: {title: 'Dettaglio Tipo Pacchetto', back: true }
            },
            {
                path: 'bundles/:id', component: BundleDetailsComponent,
                data: {title: 'Dettaglio Pacchetto', back: true }
            },
            {
                path: 'bundles', component: BundlesCustomerComponent,
                data: {title: 'Pacchetti' }
            },
            {
                path: 'events/:id', component: EventDetailsComponent,
                data: {title: 'Dettaglio Evento', back: true }
            },
            {
                path: 'stats', component: CustomerStatsComponent,
                data: {title: 'Risultati'}
            },
            {
                path: 'home', component: HomeComponent,
                data: {title: 'Home' }
            },
            {
                path: 'profile', component: ProfileComponent,
                canActivate: [AuthGuardService],
                data: {title: 'Profilo'}
            },
            {
                path: 'settings/gym', component: GymSettingsComponent,
                canActivate: [AuthGuardService],
                data: {title: 'Palestra' }
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
export class CustomerRouting { }
