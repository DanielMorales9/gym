import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {AppRouting} from './app.routing';
import {SharedModule} from './shared';
import {CoreModule} from './core';
import {
    AppService,
    AuthenticatedService,
    AuthService,
    BundleFacade,
    CalendarFacade,
    DateService,
    GlobalErrorHandler,
    GymService,
    NotificationService,
    SaleFacade,
    SnackBarService
} from './services';
import {ErrorComponent, GymModalComponent, GymSettingsComponent, ProfileComponent} from './components';
import {TimeAgoPipe} from 'time-ago-pipe';
import {
    MatButtonModule,
    MatCardModule, MatCheckboxModule, MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule, MatRadioModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatToolbarModule
} from '@angular/material';
import {RoleGuardService} from './services/role.guard.service';
import {AuthGuardService} from './services/auth.guard.service';
import {ChangePasswordModalComponent} from './components/change-password-modal.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Map2DayPipe} from './pipes/map2day.pipe';

@NgModule({
    declarations: [
        AppComponent,
        ChangePasswordModalComponent,
        ErrorComponent,
        ProfileComponent,
        GymSettingsComponent,
        GymModalComponent,
        TimeAgoPipe,
        Map2DayPipe
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CoreModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        AppRouting,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        MatToolbarModule,
        MatListModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatRadioModule,
        MatDialogModule
    ],
    entryComponents: [
        ChangePasswordModalComponent,
        GymModalComponent
    ],
    providers: [
        AppService,
        AuthService,
        AuthenticatedService,
        AuthGuardService,
        RoleGuardService,
        GymService,
        DateService,
        SnackBarService,
        SaleFacade,
        CalendarFacade,
        BundleFacade,
        NotificationService,
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

