import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TrainerCalendarComponent} from './calendar';
import {UserControlsComponent, UserDetailsComponent, UsersComponent} from '../shared/users';
import {BundleDetailsComponent, BundlesComponent, BundlesCustomerComponent} from '../shared/bundles';
import {BundleSpecDetailsComponent, BundleSpecsComponent} from '../shared/bundle-specs';
import {HomeComponent} from './home';
import {GymSettingsComponent} from '../shared/settings';
import {ProfileComponent} from '../shared/profile';
import {ACustomerCalendarComponent, CalendarControlsComponent, CalendarCustomerControlsComponent} from '../shared/calendar';
import {EventDetailsComponent} from '../shared/events';
import {CustomerStatsComponent} from '../shared/stats';
import {AssignWorkoutsComponent, ProgrammeComponent, WorkoutDetailsComponent, WorkoutsComponent} from '../shared/workout';
import {SessionsCustomerComponent} from '../shared/sessions';

const routes = [
    { path: '', children : [
            {
                path: 'calendar', component: TrainerCalendarComponent,
                data: {title: 'Calendario', secondary: CalendarControlsComponent}
            },
            {
                path: 'users', component: UsersComponent,
                data: {title: 'Utenti'}
            },
            {
                path: 'bundles', component: BundlesComponent,
                data: {title: 'Pacchetti' }
            },
            {
                path: 'users/:id', component: UserDetailsComponent,
                data: {title: 'Scheda Cliente', secondary: UserControlsComponent}
            },
            {
                path: 'bundleSpecs', component: BundleSpecsComponent,
                data: {title: 'Tipi Pacchetti'}
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
                path: 'events/:id', component: EventDetailsComponent,
                data: {title: 'Dettaglio Evento', back: true }
            },
            {
                path: 'customer/:id/bundles', component: BundlesCustomerComponent,
                data: {title: 'Pacchetti Cliente', back: true, secondary: UserControlsComponent }
            },
            {
                path: 'customer/:id/stats', component: CustomerStatsComponent,
                data: {title: 'Risultati Cliente', back: true, secondary: UserControlsComponent }
            },
            {
                path: 'calendar/:id', component: ACustomerCalendarComponent,
                data: {title: 'Calendario Cliente', secondary: CalendarCustomerControlsComponent, back: true}
            },
            {
                path: 'workouts', component: WorkoutsComponent,
                data: {title: 'Workout'}
            },
            {
                path: 'workouts/:id', component: WorkoutDetailsComponent,
                data: {title: 'Dettaglio Workout', back: true}
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
                path: 'sessions/:sessionId/assignWorkout', component: AssignWorkoutsComponent,
                data: {title: 'Assegna Workout', back: true }
            },
            {
                path: 'sessions/:sessionId/programme', component: ProgrammeComponent,
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
                path: 'customer/:id/sessions', component: SessionsCustomerComponent,
                data: {title: 'Allenamenti Cliente', back: true, secondary: UserControlsComponent }
            },
            {
                path: 'home', component: HomeComponent,
                data: {title: 'Home' }
            },
            {
                path: 'profile', component: ProfileComponent,
                data: {title: 'Profilo'}
            },
            {
                path: 'settings/gym', component: GymSettingsComponent,
                data: {title: 'Palestra'}
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
export class TrainerRouting { }
