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
    SpecFacade,
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
    MatListModule, MatRadioModule, MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule, MatTableModule,
    MatToolbarModule
} from '@angular/material';
import {RoleGuardService} from './services/role.guard.service';
import {AuthGuardService} from './services/auth.guard.service';
import {ChangePasswordModalComponent} from './components/change-password-modal.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BundleService} from './services/bundle.service';

@NgModule({
    declarations: [
        AppComponent,
        ChangePasswordModalComponent,
        ErrorComponent,
        ProfileComponent,
        GymSettingsComponent,
        GymModalComponent,
        TimeAgoPipe,
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
        MatDialogModule,
        MatTableModule,
        MatCheckboxModule,
        MatSelectModule
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
        BundleService,
        SaleFacade,
        CalendarFacade,
        SpecFacade,
        NotificationService,
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
