import {NgModule} from '@angular/core';
import {BundleItemComponent, BundleModalComponent, BundlesComponent} from './bundles';
import {CommonModule} from '@angular/common';
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
import {UserCreateModalComponent, UserDetailsComponent, UserItemComponent, UsersComponent} from './users';
import {SharedModule} from '../../shared';
import {BundleSelectItemComponent, CreateSaleComponent, SalesModalComponent, SalesSummaryComponent} from './sales';

@NgModule({
    imports: [
        AdminRouting,
        SharedModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
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
        BundleSelectItemComponent,
        UsersComponent,
        UserItemComponent,
        UserDetailsComponent,
        UserCreateModalComponent,
        CreateSaleComponent,
        SalesSummaryComponent,
        SalesModalComponent,
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
        UserCreateModalComponent,
        SalesModalComponent
    ]
})
export class AdminModule { }
