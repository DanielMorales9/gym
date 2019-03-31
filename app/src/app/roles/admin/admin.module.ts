import {NgModule} from "@angular/core";
import {BundleModalComponent, BundlesComponent} from "./bundles";
import {CommonModule} from "@angular/common";
import {AdminRouting} from "./admin.routing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
    MatButtonModule, MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatToolbarModule
} from '@angular/material';
import {ScrollingModule} from "@angular/cdk/scrolling";
import {UserCreateModalComponent, UserDetailsComponent, UsersComponent} from './users';
import {SharedModule} from "../../shared";

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
        ScrollingModule
    ],

    declarations: [
        BundlesComponent,
        BundleModalComponent,
        UsersComponent,
        UserDetailsComponent,
        UserCreateModalComponent
    ],
    entryComponents: [
        BundleModalComponent,
        UserCreateModalComponent
    ]
})
export class AdminModule { }
