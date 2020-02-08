import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {CommonModule, registerLocaleData} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {
    MAT_CHECKBOX_CLICK_ACTION,
    MatButtonModule,
    MatDialogModule, MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule, MatListModule
} from '@angular/material';
import {TrainerRouting} from './trainer.routing';
import {
    TrainerCalendarComponent,
    TrainerChangeModalComponent,
    TrainerDeleteModalComponent,
    TrainerHeaderModalComponent,
    TrainerHourModalComponent,
    TrainerInfoModalComponent
} from './calendar';
import localeIt from '@angular/common/locales/it';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {HAMMER_GESTURE_CONFIG, HammerGestureConfig} from '@angular/platform-browser';
import * as Hammer from 'hammerjs';
import {HomeComponent} from './home';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatDatepickerModule} from '@angular/material/datepicker';

export class MyHammerConfig extends HammerGestureConfig {
    overrides = <any>{
        swipe: {direction: Hammer.DIRECTION_HORIZONTAL},
    };
}
registerLocaleData(localeIt);


@NgModule({
    imports: [
        TrainerRouting,
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
        MatListModule,
        MatExpansionModule,
        NgxMaterialTimepickerModule.setLocale('it-IT'),
        MatDatepickerModule

    ],
    declarations: [
        TrainerCalendarComponent,
        TrainerChangeModalComponent,
        TrainerDeleteModalComponent,
        TrainerHeaderModalComponent,
        TrainerHourModalComponent,
        TrainerInfoModalComponent,
        HomeComponent
    ],
    providers: [
        {provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check'},
        {provide: MAT_DATE_LOCALE, useValue: 'it-IT'},
        { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig },

    ],
    exports: [
    ],
    entryComponents: [
        TrainerChangeModalComponent,
        TrainerDeleteModalComponent,
        TrainerHeaderModalComponent,
        TrainerHourModalComponent,
        TrainerInfoModalComponent
    ]
})
export class TrainerModule { }
