import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    BundleDetailsComponent, NoCardComponent,
    PagerComponent,
    SaleDetailsComponent,
    SaleModalComponent, SalesComponent, SpinnerComponent, UserPatchModalComponent,
} from "./components";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
    BundlesService,
    SalesService,
    TimesOffService,
    TrainingService, UserHelperService,
    UserService
} from "./services";
import {
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule
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
        MatButtonModule,
        MatProgressSpinnerModule,
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
        SpinnerComponent,
        UserPatchModalComponent
    ],
    exports: [
        SalesComponent,
        SaleDetailsComponent,
        SaleModalComponent,
        NoCardComponent,
        PagerComponent,
        BundleDetailsComponent,
        SpinnerComponent
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