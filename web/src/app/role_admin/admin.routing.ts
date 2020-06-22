import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CreateSaleComponent} from './sales';
import {AdminCalendarComponent} from './calendar';
import {SaleDetailsComponent, SalesComponent} from '../shared/sales';
import {UserControlsComponent, UserDetailsComponent, UsersComponent} from '../shared/users';
import {BundleSpecDetailsComponent, BundleSpecsComponent} from '../shared/bundle-specs';
import {BundleDetailsComponent, BundlesComponent, BundlesCustomerComponent} from '../shared/bundles';
import {HomeComponent} from './home';
import {ProfileComponent} from '../shared/profile';
import {GymSettingsComponent} from '../shared/settings';
import {ACustomerCalendarComponent, CalendarControlsComponent, CalendarCustomerControlsComponent} from '../shared/calendar';
import {EventDetailsComponent} from '../shared/events';
import {StatsComponent} from './stats';
import {CustomerStatsComponent} from '../shared/stats';
import {AssignWorkoutsComponent, ProgrammeComponent} from '../shared/workout';
import {SessionsCustomerComponent} from '../shared/sessions';

const routes = [

    { path: '', children : [
            {
                path: 'bundleSpecs', component: BundleSpecsComponent,
                data: {title: 'Tipi Pacchetti' }
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
                path: 'bundles', component: BundlesComponent,
                data: {title: 'Pacchetti' }
            },
            {
                path: 'customer/:id/bundles', component: BundlesCustomerComponent,
                data: {title: 'Pacchetti Cliente', back: true, secondary: UserControlsComponent }
            },
            {
                path: 'customer/:id/sessions', component: SessionsCustomerComponent,
                data: {title: 'Allenamenti Cliente', back: true, secondary: UserControlsComponent }
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
                path: 'sales/buy/:id', component: CreateSaleComponent,
                data: {title: 'Crea Vendita', back: true, secondary: UserControlsComponent}
            },
            {
                path: 'sales', component: SalesComponent,
                data: {title: 'Vendite'}
            },
            {
                path: 'sales/:id', component: SaleDetailsComponent,
                data: {title: 'Dettaglio Vendita', back: true}
            },
            {
                path: 'customer/:id/sales', component: SalesComponent,
                data: {title: 'Ordini Cliente', back: true, secondary: UserControlsComponent }
            },
            {
                path: 'customer/:id/stats', component: CustomerStatsComponent,
                data: {title: 'Risultati Cliente', back: true, secondary: UserControlsComponent }
            },
            {
                path: 'calendar', component: AdminCalendarComponent,
                data: {title: 'Calendario', secondary: CalendarControlsComponent}
            },
            {
                path: 'calendar/:id', component: ACustomerCalendarComponent,
                data: {title: 'Calendario Cliente', secondary: CalendarCustomerControlsComponent, back: true}
            },
            {
                path: 'events/:id', component: EventDetailsComponent,
                data: {title: 'Dettaglio Evento', back: true }
            },
            {
                path: 'events/:id/sessions/:sessionId/assignWorkout', component: AssignWorkoutsComponent,
                data: {title: 'Assegna Workout', back: true }
            },
            {
                path: 'events/:id/sessions/:sessionId/programme', component: ProgrammeComponent,
                data: {title: 'Programma di Allenamento', back: true }
            },
            {
                path: 'customer/:id/sessions/:sessionId/assignWorkout', component: AssignWorkoutsComponent,
                data: {title: 'Assegna Workout', back: true }
            },
            {
                path: 'customer/:id/sessions/:sessionId/programme', component: ProgrammeComponent,
                data: {title: 'Programma di Allenamento', back: true }
            },
            {
                path: 'sessions/:sessionId/assignWorkout', component: AssignWorkoutsComponent,
                data: {title: 'Assegna Workout', back: true }
            },
            {
                path: 'sessions/:sessionId/programme', component: ProgrammeComponent,
                data: {title: 'Programma di Allenamento', back: true }
            },
            {
                path: 'profile', component: ProfileComponent,
                data: {title: 'Profilo'}
            },
            {
                path: 'settings/gym', component: GymSettingsComponent,
                data: {title: 'La mia Palestra' }
            },
            {
                path: 'stats', component: StatsComponent,
                data: {title: 'Statistiche' }
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
