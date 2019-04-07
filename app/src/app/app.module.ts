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
    ChangeViewService,
    DateService,
    GlobalErrorHandler,
    GymConfigurationService,
    NotificationService,
    SnackBarService
} from './services';
import {ErrorComponent, NotificationsComponent, ProfileComponent} from './components';
import {TimeAgoPipe} from 'time-ago-pipe';
import {
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSidenavModule, MatSnackBarModule,
    MatToolbarModule
} from '@angular/material';
import {RoleGuardService} from './services/role.guard.service';
import {AuthGuardService} from './services/auth.guard.service';
import {ChangePasswordModalComponent} from './components/change-password-modal.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// TODO add snackbar everywhere

@NgModule({
    declarations: [
        AppComponent,
        ChangePasswordModalComponent,
        ErrorComponent,
        NotificationsComponent,
        ProfileComponent,
        TimeAgoPipe
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
        MatSnackBarModule
    ],
    entryComponents: [
        ChangePasswordModalComponent
    ],
    providers: [
        AppService,
        AuthService,
        AuthenticatedService,
        AuthGuardService,
        RoleGuardService,
        GymConfigurationService,
        DateService,
        SnackBarService,

        NotificationService,
        ChangeViewService,
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

