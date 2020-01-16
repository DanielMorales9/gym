import {NgModule} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {AdminRouting} from './admin.routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    MAT_CHECKBOX_CLICK_ACTION,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatSnackBarModule,
    MatToolbarModule
} from '@angular/material';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {BundleSelectItemComponent, BundleSelectModalComponent, BundleSpecSelectItemComponent, CreateSaleComponent} from './sales';
import {
    AdminCalendarComponent,
    AdminChangeModalComponent,
    AdminDeleteModalComponent,
    AdminHeaderModalComponent,
    AdminInfoModalComponent
} from './calendar';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {AdminHourModalComponent} from './calendar/admin-hour-modal.component';
import localeIt from '@angular/common/locales/it';
import {SharedModule} from '../shared';
import {ACustomerCalendarComponent} from './customer-calendar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {HAMMER_GESTURE_CONFIG, HammerGestureConfig} from '@angular/platform-browser';
import * as Hammer from 'hammerjs';
import {CalendarNextViewDirective} from 'angular-calendar/modules/common/calendar-next-view.directive';
import {CalendarPreviousViewDirective} from 'angular-calendar/modules/common/calendar-previous-view.directive';

registerLocaleData(localeIt);

export class MyHammerConfig extends HammerGestureConfig {
    overrides = <any> {
        swipe: { direction: Hammer.DIRECTION_ALL },
    };
}

@NgModule({
    imports: [
        AdminRouting,
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
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatDatepickerModule,
        MatToolbarModule,
        MatExpansionModule,
        MatDividerModule,
        MatCardModule,
        MatListModule,
        MatSnackBarModule,
        ScrollingModule,
        MatCheckboxModule
    ],
    declarations: [
        BundleSpecSelectItemComponent,
        BundleSelectItemComponent,
        CreateSaleComponent,
        AdminCalendarComponent,
        AdminHeaderModalComponent,
        AdminChangeModalComponent,
        AdminHourModalComponent,
        AdminInfoModalComponent,
        AdminDeleteModalComponent,
        ACustomerCalendarComponent,
        BundleSelectModalComponent
    ],
    providers: [
        { provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check' },
        { provide: MAT_DATE_LOCALE, useValue: 'it-IT' },
        { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig },
    ],
    entryComponents: [
        AdminHeaderModalComponent,
        AdminChangeModalComponent,
        AdminHourModalComponent,
        AdminInfoModalComponent,
        AdminDeleteModalComponent,
        BundleSelectModalComponent
    ]
})
export class AdminModule { }
