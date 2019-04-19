import {NgModule} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {HomeRouting} from './home.routing';
import {HomeComponent} from './home.component';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {
    TrainerCalendarComponent,
    TrainerChangeModalComponent,
    TrainerDeleteModalComponent,
    TrainerHeaderModalComponent,
    TrainerHourModalComponent,
    TrainerInfoModalComponent
} from './calendar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import localeIt from '@angular/common/locales/it';

registerLocaleData(localeIt);


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
        HomeRouting
    ],
    declarations: [
        HomeComponent,

    ],
})
export class HomeModule { }
