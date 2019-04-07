import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    NoItemComponent,
    UserModalComponent,
} from './components';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
    BundleHelperService,
    BundlesNotDisabledService,
    BundlesService, HelperService,
    SalesService,
    TimesOffService,
    TrainingService,
    UserHelperService,
    UserService
} from './services';
import {
    MatButtonModule,
    MatCardModule, MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule, MatListModule, MatNativeDateModule, MatOptionModule, MatSelectModule, MatToolbarModule
} from '@angular/material';
import {SearchWithDateToolbar, SimpleSearchToolbar} from './directives';
import {SaleHelperService} from './services/sale-helper.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
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
        MatNativeDateModule
    ],
    entryComponents: [
        UserModalComponent
    ],
    declarations: [
        NoItemComponent,
        SimpleSearchToolbar,
        SearchWithDateToolbar,
        UserModalComponent
    ],
    exports: [
        NoItemComponent,
        SimpleSearchToolbar,
        SearchWithDateToolbar
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
        BundleHelperService
    ]

})
export class SharedModule {

}
