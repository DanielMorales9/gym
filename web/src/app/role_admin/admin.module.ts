import { NgModule, Injectable } from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {AdminRouting} from './admin.routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_CHECKBOX_CLICK_ACTION, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
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
import localeIt from '@angular/common/locales/global/it';
import {SharedModule} from '../shared/shared.module';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule} from '@angular/platform-browser';
import * as Hammer from 'hammerjs';
import {HomeComponent} from './home';
import {NgxMaterialTimepickerComponent, NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { StatsComponent } from './stats';
import {ChartsModule} from 'ng2-charts';
import {MatMenuModule} from '@angular/material/menu';
import {MatTabsModule} from '@angular/material/tabs';

registerLocaleData(localeIt);

@Injectable()
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
        NgxMaterialTimepickerModule.setLocale('it-IT'),
        ChartsModule,
        MatMenuModule,
        MatTabsModule,
        HammerModule
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
        StatsComponent,
        HomeComponent,
        StatsComponent
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
