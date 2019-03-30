import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    BundleDetailsComponent,
    NoCardComponent,
    PagerComponent,
    SaleDetailsComponent,
    SaleModalComponent,
    SalesComponent,
    UserPatchModalComponent,
} from "./components";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
    BundlesService,
    SalesService,
    TimesOffService,
    TrainingService,
    UserHelperService,
    UserService
} from "./services";
import {
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
} from "@angular/material";

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
        MatButtonModule
    ],
    entryComponents: [
        UserPatchModalComponent
    ],
    declarations: [
        SalesComponent,
        SaleDetailsComponent,
        SaleModalComponent,
        NoCardComponent,
        PagerComponent,
        BundleDetailsComponent,
        UserPatchModalComponent
    ],
    exports: [
        SalesComponent,
        SaleDetailsComponent,
        SaleModalComponent,
        NoCardComponent,
        PagerComponent,
        BundleDetailsComponent,
    ],
    providers: [
        BundlesService,
        SalesService,
        TimesOffService,
        TrainingService,
        UserService,
        UserHelperService
    ]

})
export class SharedModule {

}