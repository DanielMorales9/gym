import {NgModule} from '@angular/core';
import {SharedModule} from '../shared';
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
    MatInputModule, MatOptionModule, MatSelectModule,
    MatTabsModule,
    MatToolbarModule
} from '@angular/material';
import {CustomerRouting} from './customer.routing';
import {CustomerCalendarComponent, CustomerInfoModalComponent} from './calendar';
import localeIt from '@angular/common/locales/it';
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
        MatToolbarModule,
        MatOptionModule,
        MatSelectModule
    ],
    declarations: [
        CustomerCalendarComponent,
        CustomerInfoModalComponent,
    ],
    providers: [
        {provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check'}
    ],
    exports: [
    ],
    entryComponents: [
        CustomerInfoModalComponent,
    ]
})
export class CustomerModule { }
