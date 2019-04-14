import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NoItemComponent, SearchWithDateToolbar, SimpleSearchToolbar, UserModalComponent,} from './components';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    BundleHelperService, BundlePayHelperService,
    BundlesNotDisabledService,
    BundlesService,
    SalesService,
    TimesOffService,
    TrainingService,
    UserHelperService,
    UserService
} from './services';
import {
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule,
    MatToolbarModule
} from '@angular/material';
import {SaleHelperService} from './services/sale-helper.service';
import {CalendarFooterToolbar, CalendarHeaderToolbar} from './components/calendar';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatDialogModule,
        MatInputModule,
        MatButtonModule,
        MatListModule,
        MatOptionModule,
        MatSelectModule,
        MatToolbarModule,
        MatDatepickerModule,
        MatNativeDateModule
    ],
    entryComponents: [
        UserModalComponent
    ],
    declarations: [
        NoItemComponent,
        CalendarHeaderToolbar,
        CalendarFooterToolbar,
        SimpleSearchToolbar,
        SearchWithDateToolbar,
        UserModalComponent
    ],
    exports: [
        NoItemComponent,
        CalendarHeaderToolbar,
        CalendarFooterToolbar,
        SimpleSearchToolbar,
        SearchWithDateToolbar
    ],
    providers: [
        BundlesService,
        BundlesNotDisabledService,
        SalesService,
        TimesOffService,
        TrainingService,
        UserService,
        UserHelperService,
        SaleHelperService,
        BundleHelperService,
        BundlePayHelperService,
    ]

})
export class SharedModule {

}
