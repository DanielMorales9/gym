import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared';
import {CommonModule, registerLocaleData} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {
    MAT_CHECKBOX_CLICK_ACTION,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    MatToolbarModule
} from '@angular/material';
import {CustomerRouting} from './customer.routing';
import {CustomerCalendarComponent, CustomerDeleteModalComponent, CustomerHourModalComponent, CustomerInfoModalComponent} from './calendar';
import localeIt from '@angular/common/locales/it';
import {SalesComponent} from './sales';
import {ScrollingModule} from '@angular/cdk/scrolling';

registerLocaleData(localeIt);

@NgModule({
    imports: [
        CustomerRouting,
        SharedModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatTabsModule,
        ScrollingModule,
        MatToolbarModule
    ],
    declarations: [
        CustomerCalendarComponent,
        CustomerHourModalComponent,
        CustomerInfoModalComponent,
        CustomerDeleteModalComponent,
        SalesComponent
    ],
    providers: [
        {provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check'}
    ],
    exports: [
    ],
    entryComponents: [
        CustomerHourModalComponent,
        CustomerInfoModalComponent,
        CustomerDeleteModalComponent,
    ]
})
export class CustomerModule { }