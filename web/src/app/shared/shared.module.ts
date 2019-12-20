import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    BundleDetailsComponent,
    BundleModalComponent,
    SalesComponent,
    UserDetailsComponent,
    UserItemComponent,
    UserModalComponent,
    UsersComponent,
    InfoCourseEventComponent, DeletePersonalEventComponent,
    GymClosedComponent,
    NoItemComponent, InfoPersonalEventComponent,
    SearchDateToolbar,
    SearchMixedToolbar,
    SimpleSearchToolbar,
    DeleteTimeOffEventComponent, ReservationsComponent
} from './components';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule,
    MatToolbarModule
} from '@angular/material';
import {CalendarButtonToolbar, CalendarHeaderToolbar} from './components/calendar';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {PaySaleModalComponent, SaleDetailsComponent, SaleItemComponent} from './components/sales';
import {RouterModule} from '@angular/router';
import {ScrollingModule} from '@angular/cdk/scrolling';

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
    ],

    entryComponents: [
        UserModalComponent,
        PaySaleModalComponent,
        BundleModalComponent
    ],
    declarations: [
        NoItemComponent,
        GymClosedComponent,
        InfoCourseEventComponent,
        InfoPersonalEventComponent,
        DeletePersonalEventComponent,
        DeleteTimeOffEventComponent,
        ReservationsComponent,
        SearchDateToolbar,
        SimpleSearchToolbar,
        SearchMixedToolbar,
        CalendarHeaderToolbar,
        CalendarButtonToolbar,
        UserModalComponent,
        SaleItemComponent,
        PaySaleModalComponent,
        SaleDetailsComponent,
        BundleModalComponent,
        BundleDetailsComponent,
        SalesComponent,
        UsersComponent,
        UserItemComponent,
        UserDetailsComponent
    ],
    exports: [
        NoItemComponent,
        GymClosedComponent,
        InfoPersonalEventComponent,
        DeletePersonalEventComponent,
        DeleteTimeOffEventComponent,
        InfoCourseEventComponent,
        ReservationsComponent,
        CalendarHeaderToolbar,
        CalendarButtonToolbar,
        SimpleSearchToolbar,
        SearchMixedToolbar,
        SearchDateToolbar,
        SaleItemComponent,
        PaySaleModalComponent,
        SaleDetailsComponent,
        BundleModalComponent,
        BundleDetailsComponent,
        SalesComponent
    ],
    providers: []

})
export class SharedModule {

}
