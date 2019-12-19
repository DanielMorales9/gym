import {NgModule} from '@angular/core';
import {SharedModule} from '../shared';
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
    ],
    declarations: [
        TrainerCalendarComponent,
        TrainerChangeModalComponent,
        TrainerDeleteModalComponent,
        TrainerHeaderModalComponent,
        TrainerHourModalComponent,
        TrainerInfoModalComponent
    ],
    providers: [
        {provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check'}
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
