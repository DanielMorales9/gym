import {NgModule} from '@angular/core';
import {BundleDetailsComponent, BundleItemComponent, BundleModalComponent, BundlesComponent} from './bundles';
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
import {UserDetailsComponent, UserItemComponent, UsersComponent} from './users';
import {SharedModule} from '../../shared';
import {
    BundleSelectItemComponent,
    CreateSaleComponent,
    PaySaleModalComponent,
    SaleDetailsComponent,
    SalesComponent,
    SaleItemComponent
} from './sales';
import {
    AdminCalendarComponent,
    AdminChangeModalComponent,
    AdminDeleteModalComponent,
    AdminHeaderModalComponent,
    AdminInfoModalComponent
} from './calendar';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import localeIt from '@angular/common/locales/it';
import {AdminHourModalComponent} from './calendar/admin-hour-modal.component';

registerLocaleData(localeIt);

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
        BundlesComponent,
        BundleItemComponent,
        BundleModalComponent,
        BundleDetailsComponent,
        BundleSelectItemComponent,
        UsersComponent,
        UserItemComponent,
        UserDetailsComponent,
        CreateSaleComponent,
        SalesComponent,
        SaleItemComponent,
        SaleDetailsComponent,
        PaySaleModalComponent,
        AdminCalendarComponent,
        AdminHeaderModalComponent,
        AdminChangeModalComponent,
        AdminHourModalComponent,
        AdminInfoModalComponent,
        AdminDeleteModalComponent,
    ],
    providers: [
        {provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check'}
    ],
    exports: [
        BundleItemComponent,
        UserItemComponent
    ],
    entryComponents: [
        BundleModalComponent,
        PaySaleModalComponent,
        AdminHeaderModalComponent,
        AdminChangeModalComponent,
        AdminHourModalComponent,
        AdminInfoModalComponent,
        AdminDeleteModalComponent
    ]
})
export class AdminModule { }
