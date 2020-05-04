import {BrowserModule, HammerModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule, Pipe} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {AppRouting} from './app.routing';
import {SharedModule} from './shared/shared.module';
import {CoreModule} from './core';
import {AppService, GlobalErrorHandler, GymService} from './services';
import {
    ErrorComponent, NavBarComponent,
    PrimaryAdminControlsComponent,
    PrimaryCustomerControlsComponent,
    PrimaryTrainerControlsComponent,
    SideBarComponent
} from './components';
import {TimeAgoPipe} from 'time-ago-pipe';
import {
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTableModule,
    MatToolbarModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {MatMenuModule} from '@angular/material/menu';

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({
    name: 'timeAgo',
    pure: false
})
export class TimeAgoExtendsPipe extends TimeAgoPipe {}

@NgModule({
    declarations: [
        AppComponent,
        PrimaryAdminControlsComponent,
        PrimaryTrainerControlsComponent,
        PrimaryCustomerControlsComponent,
        ErrorComponent,
        SideBarComponent,
        NavBarComponent,
        TimeAgoExtendsPipe,
    ],
    entryComponents: [
        PrimaryAdminControlsComponent,
        PrimaryTrainerControlsComponent,
        PrimaryCustomerControlsComponent,
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
        MatSelectModule,
        NgxMaterialTimepickerModule.setLocale('it-IT'),
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
        MatMenuModule,
        HammerModule,
    ],
    providers: [
        AppService,
        GymService,
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        { provide: MAT_DATE_LOCALE, useValue: 'it-IT' },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
