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
import {BundleSpecSelectItemComponent, CreateSaleComponent, OptionSelectItemComponent, OptionSelectModalComponent} from './sales';
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
import {SharedModule} from '../shared/shared.module';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {HAMMER_GESTURE_CONFIG, HammerGestureConfig} from '@angular/platform-browser';
import * as Hammer from 'hammerjs';
import {HomeComponent} from './home';
import {NgxMaterialTimepickerComponent, NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

registerLocaleData(localeIt);

export class MyHammerConfig extends HammerGestureConfig {
    overrides = <any>{
        swipe: {direction: Hammer.DIRECTION_HORIZONTAL},
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
        MatCheckboxModule,
        NgxMaterialTimepickerModule.setLocale('it-IT')
    ],
    declarations: [
        BundleSpecSelectItemComponent,
        OptionSelectItemComponent,
        CreateSaleComponent,
        AdminCalendarComponent,
        AdminHeaderModalComponent,
        AdminChangeModalComponent,
        AdminHourModalComponent,
        AdminInfoModalComponent,
        AdminDeleteModalComponent,
        OptionSelectModalComponent,
        HomeComponent
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
        OptionSelectModalComponent,
        NgxMaterialTimepickerComponent,
    ]
})
export class AdminModule { }
