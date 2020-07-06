import { NgModule, Injectable } from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {CommonModule, registerLocaleData} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import { MatButtonModule } from '@angular/material/button';
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import {TrainerRouting} from './trainer.routing';
import {
    TrainerCalendarComponent,
    TrainerChangeModalComponent,
    TrainerDeleteModalComponent,
    TrainerHeaderModalComponent,
    TrainerHourModalComponent,
    TrainerInfoModalComponent
} from './calendar';
import localeIt from '@angular/common/locales/global/it';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule} from '@angular/platform-browser';
import * as Hammer from 'hammerjs';
import {HomeComponent} from './home';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatDatepickerModule} from '@angular/material/datepicker';

@Injectable()
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
        MatDatepickerModule,
        HammerModule
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
