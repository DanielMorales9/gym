import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    ACustomerCalendarComponent,
    BundleItemComponent,
    BundleModalComponent,
    BundlesComponent,
    BundlesCustomerComponent,
    BundleSpecDetailsComponent,
    BundleSpecItemComponent,
    BundleSpecModalComponent,
    BundleSpecsComponent,
    CalendarControlsComponent,
    CalendarCustomerControlsComponent,
    ChangePasswordModalComponent,
    CustomerInfoModalComponent,
    DeleteHolidayEventComponent,
    DeletePersonalEventComponent,
    DeleteReservationCourseEventComponent,
    DeleteTimeOffEventComponent,
    EventDetailsComponent,
    FilterComponent,
    FilterSearchToolbar,
    GymClosedComponent,
    InfoCourseEventComponent,
    InfoPersonalEventComponent,
    NoItemComponent,
    OptionModalComponent,
    ProfileComponent,
    ReservationModalComponent,
    ImageModalComponent,
    ImageCropModalComponent,
    ReservationsComponent,
    ReserveCourseEventComponent,
    SalesComponent,
    SearchDateToolbar,
    SearchMixedToolbar,
    SimpleSearchToolbar,
    UserControlsComponent,
    UserDetailsComponent,
    UserItemComponent,
    UserModalComponent,
    UsersComponent,
    WorkoutsComponent,
    WorkoutModalComponent,
    WorkoutItemComponent,
    WorkoutDetailsComponent,
    AssignWorkoutsComponent,
    WorkoutSelectItemComponent, ProgrammeComponent, MapStringPipe, BundleProgressComponent
} from './index';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import {CalendarButtonToolbar, CalendarHeaderToolbar, CustomerDeleteModalComponent, CustomerHourModalComponent} from './calendar';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {PaySaleModalComponent, SaleDetailsComponent, SaleItemComponent} from './sales';
import {RouterModule} from '@angular/router';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {BundleDetailsComponent} from './bundles';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatTreeModule} from '@angular/material/tree';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTableModule} from '@angular/material/table';
import {GymModalComponent, GymSettingsComponent} from './settings';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {CustomerStatsComponent} from './stats';
import {MatTabsModule} from '@angular/material/tabs';
import {ChartsModule} from 'ng2-charts';
import {LyImageCropperModule} from '@alyle/ui/image-cropper';
import {LySliderModule} from '@alyle/ui/slider';
import {LY_THEME, LY_THEME_NAME, LyHammerGestureConfig, LyTheme2, StyleRenderer} from '@alyle/ui';
import {MinimaDark, MinimaLight} from '@alyle/ui/themes/minima';
import {HAMMER_GESTURE_CONFIG, HammerModule} from '@angular/platform-browser';
import {LyButtonModule} from '@alyle/ui/button';
import {LyIconModule} from '@alyle/ui/icon';
import {LyDialogModule} from '@alyle/ui/dialog';
import {SessionItemComponent, SessionsCustomerComponent} from './sessions';
import {CdkTableModule} from '@angular/cdk/table';
import {NgbProgressbarModule} from '@ng-bootstrap/ng-bootstrap';
import {AvatarComponent} from './profile/avatar.component';

// @ts-ignore
@NgModule({
    imports: [
        RouterModule,
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
        MatNativeDateModule,
        MatExpansionModule,
        MatCheckboxModule,
        ScrollingModule,
        MatMenuModule,
        MatTreeModule,
        MatBadgeModule,
        MatTableModule,
        NgxMaterialTimepickerModule.setLocale('it-IT'),
        MatTabsModule,
        ChartsModule,
        LyImageCropperModule,
        LySliderModule,
        LyButtonModule,
        LyIconModule,
        LyDialogModule,
        HammerModule,
        CdkTableModule,
        NgbProgressbarModule
    ],
    entryComponents: [
        UserModalComponent,
        PaySaleModalComponent,
        BundleSpecModalComponent,
        CustomerHourModalComponent,
        CustomerInfoModalComponent,
        CustomerDeleteModalComponent,
        BundleModalComponent,
        OptionModalComponent,
        ChangePasswordModalComponent,
        GymModalComponent,
        CalendarControlsComponent,
        CalendarCustomerControlsComponent,
        UserControlsComponent,
        ReservationModalComponent,
        ImageModalComponent,
        ImageCropModalComponent,
        WorkoutModalComponent
    ],
    declarations: [
        NoItemComponent,
        GymClosedComponent,
        ACustomerCalendarComponent,
        InfoCourseEventComponent,
        ReserveCourseEventComponent,
        InfoPersonalEventComponent,
        DeletePersonalEventComponent,
        DeleteTimeOffEventComponent,
        DeleteHolidayEventComponent,
        ReservationsComponent,
        DeleteReservationCourseEventComponent,
        SearchDateToolbar,
        SimpleSearchToolbar,
        FilterSearchToolbar,
        SearchMixedToolbar,
        CalendarHeaderToolbar,
        CalendarButtonToolbar,
        UserModalComponent,
        SaleItemComponent,
        PaySaleModalComponent,
        SaleDetailsComponent,
        BundleSpecModalComponent,
        BundleSpecDetailsComponent,
        BundleDetailsComponent,
        SalesComponent,
        UsersComponent,
        UserItemComponent,
        UserDetailsComponent,
        CustomerHourModalComponent,
        CustomerInfoModalComponent,
        CustomerDeleteModalComponent,
        BundleModalComponent,
        OptionModalComponent,
        BundlesCustomerComponent,
        BundleItemComponent,
        BundleSpecItemComponent,
        BundleSpecsComponent,
        FilterComponent,
        ProfileComponent,
        GymSettingsComponent,
        GymModalComponent,
        ChangePasswordModalComponent,
        CalendarControlsComponent,
        CalendarCustomerControlsComponent,
        UserControlsComponent,
        EventDetailsComponent,
        ReservationModalComponent,
        BundlesComponent,
        CustomerStatsComponent,
        ImageModalComponent,
        ImageCropModalComponent,
        WorkoutsComponent,
        WorkoutModalComponent,
        WorkoutItemComponent,
        WorkoutDetailsComponent,
        AssignWorkoutsComponent,
        ProgrammeComponent,
        SessionsCustomerComponent,
        SessionItemComponent,
        WorkoutSelectItemComponent,
        MapStringPipe,
        BundleProgressComponent,
        AvatarComponent
    ],
    exports: [
        CalendarControlsComponent,
        CalendarCustomerControlsComponent,
        UserControlsComponent,
        BundleModalComponent,
        NoItemComponent,
        FilterComponent,
        GymClosedComponent,
        InfoPersonalEventComponent,
        DeletePersonalEventComponent,
        DeleteTimeOffEventComponent,
        DeleteHolidayEventComponent,
        ReserveCourseEventComponent,
        InfoCourseEventComponent,
        ReservationsComponent,
        DeleteReservationCourseEventComponent,
        CalendarHeaderToolbar,
        CalendarButtonToolbar,
        SimpleSearchToolbar,
        SearchMixedToolbar,
        FilterSearchToolbar,
        SaleItemComponent,
        PaySaleModalComponent,
        SaleDetailsComponent,
        BundleSpecModalComponent,
        BundleSpecDetailsComponent,
        BundleDetailsComponent,
        BundlesCustomerComponent,
        BundleItemComponent,
        SalesComponent,
        CustomerHourModalComponent,
        CustomerInfoModalComponent,
        CustomerDeleteModalComponent,
        OptionModalComponent,
        BundleSpecItemComponent,
        BundleSpecsComponent,
        ProfileComponent,
        EventDetailsComponent,
        ACustomerCalendarComponent,
        BundlesComponent,
        SearchDateToolbar,
        CustomerStatsComponent,
        ImageModalComponent,
        ImageCropModalComponent,
        WorkoutsComponent,
        WorkoutModalComponent,
        WorkoutItemComponent,
        WorkoutDetailsComponent,
        AssignWorkoutsComponent,
        ProgrammeComponent,
        WorkoutSelectItemComponent,
        MapStringPipe,
        SessionsCustomerComponent,
        SessionItemComponent,
        BundleProgressComponent
    ],
    providers: [
        [ LyTheme2 ],
        [ StyleRenderer ],
        {provide: MAT_DATE_LOCALE, useValue: 'it-IT'},
        { provide: LY_THEME_NAME, useValue: 'minima-light' },
        { provide: LY_THEME, useClass: MinimaLight, multi: true }, // name: `minima-light`
        { provide: LY_THEME, useClass: MinimaDark, multi: true }, // name: `minima-dark`
        // Gestures
        { provide: HAMMER_GESTURE_CONFIG, useClass: LyHammerGestureConfig }
    ]

})
export class SharedModule {

}
