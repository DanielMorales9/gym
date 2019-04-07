import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    BundleDetailsComponent,
    NoItemComponent,
    PagerComponent,
    SaleDetailsComponent,
    SalesComponent,
    UserModalComponent,
} from './components';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
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
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule, MatListModule, MatOptionModule, MatSelectModule
} from '@angular/material';

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
        MatSelectModule
    ],
    entryComponents: [
        UserModalComponent
    ],
    declarations: [
        SalesComponent,
        SaleDetailsComponent,
        NoItemComponent,
        PagerComponent,
        BundleDetailsComponent,
        UserModalComponent
    ],
    exports: [
        SalesComponent,
        SaleDetailsComponent,
        NoItemComponent,
        PagerComponent,
        BundleDetailsComponent,
    ],
    providers: [
        BundlesService,
        BundlesNotDisabledService,
        SalesService,
        TimesOffService,
        TrainingService,
        UserService,
        UserHelperService
    ]

})
export class SharedModule {

}
