import {BrowserModule, HammerModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule, Pipe} from '@angular/core';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {AppRouting} from './app.routing';
import {SharedModule} from './shared/shared.module';
import {CoreModule} from './core';
import {GlobalErrorHandler, GymService} from './services';
import {
    CurrentRolePipe,
    ErrorComponent,
    JoinStringPipe,
    MenuControlsComponent,
    NavBarComponent,
    PrimaryAdminControlsComponent,
    PrimaryCustomerControlsComponent,
    PrimaryTrainerControlsComponent,
    ShowRolePipe,
    SideBarComponent
} from './components';
import {TimeAgoPipe} from 'time-ago-pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
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
        ShowRolePipe,
        CurrentRolePipe,
        JoinStringPipe,
        MenuControlsComponent
    ],
    entryComponents: [
        PrimaryAdminControlsComponent,
        PrimaryTrainerControlsComponent,
        PrimaryCustomerControlsComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
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
        GymService,
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        { provide: MAT_DATE_LOCALE, useValue: 'it-IT' },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
