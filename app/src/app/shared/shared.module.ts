import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    BundleDetailsComponent,
    BundleModalComponent,
    UserModalComponent,
    NoItemComponent,
    SearchDateToolbar,
    SearchMixedToolbar,
    SimpleSearchToolbar, SalesComponent
} from './components';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    BundleHelperService,
    BundlePayHelperService,
    BundlesNotDisabledService,
    BundlesService,
    SalesService,
    TimesOffService,
    TrainingService,
    UserHelperService,
    UserService
} from './services';
import {
    MatButtonModule,
    MatCardModule, MatCheckboxModule,
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
import {SaleHelperService} from './services/sale-helper.service';
import {CalendarFooterToolbar, CalendarHeaderToolbar} from './components/calendar';
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
        CalendarHeaderToolbar,
        CalendarFooterToolbar,
        SimpleSearchToolbar,
        SearchMixedToolbar,
        UserModalComponent,
        SaleItemComponent,
        PaySaleModalComponent,
        SearchDateToolbar,
        SaleDetailsComponent,
        BundleModalComponent,
        BundleDetailsComponent,
        SalesComponent
    ],
    exports: [
        NoItemComponent,
        CalendarHeaderToolbar,
        CalendarFooterToolbar,
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
    providers: [
        BundlesService,
        BundlesNotDisabledService,
        SalesService,
        TimesOffService,
        TrainingService,
        UserService,
        UserHelperService,
        SaleHelperService,
        BundleHelperService,
        BundlePayHelperService,
    ]

})
export class SharedModule {

}
