import { NgModule } from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {HomeRouting} from "./home.routing";
import {HomeComponent} from "./home.component";
import {CalendarModule, DateAdapter} from "angular-calendar";
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";
import {
    AdminCalendarComponent, AdminChangeModalComponent,
    AdminDeleteModalComponent,
    AdminHeaderModalComponent, AdminHourModalComponent,
    AdminInfoModalComponent,
    CalendarComponent,
    CustomerCalendarComponent,
    CustomerDeleteModalComponent,
    CustomerHourModalComponent,
    CustomerInfoModalComponent,
    TrainerCalendarComponent, TrainerChangeModalComponent, TrainerDeleteModalComponent,
    TrainerHeaderModalComponent, TrainerHourModalComponent,
    TrainerInfoModalComponent
} from "./calendar";
import {BundleModalComponent, BundlesComponent} from "./bundles";
import {UserCreateModalComponent, UserDetailsComponent, UsersComponent} from "./users";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared";
import localeIt from '@angular/common/locales/it';
import {
    MAT_DIALOG_DATA, MatAccordion, MatButtonModule,
    MatDialogModule,
    MatDialogRef, MatDividerModule, MatExpansionModule,
    MatFormFieldModule, MatIconModule,
    MatInputModule, MatListModule,
    MatSelectModule, MatToolbarModule
} from "@angular/material";

registerLocaleData(localeIt);


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
        SharedModule,
        HomeRouting,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        MatExpansionModule,
        MatDividerModule,
        MatListModule
    ],
    providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
    ],
    entryComponents: [UserCreateModalComponent],
    declarations: [
        HomeComponent,
        UsersComponent,
        UserCreateModalComponent,
        UserDetailsComponent,
        BundlesComponent,
        BundleModalComponent,
        CalendarComponent,
        CustomerCalendarComponent,
        CustomerHourModalComponent,
        CustomerInfoModalComponent,
        CustomerDeleteModalComponent,
        AdminCalendarComponent,
        AdminHourModalComponent,
        AdminChangeModalComponent,
        AdminInfoModalComponent,
        AdminHeaderModalComponent,
        AdminDeleteModalComponent,
        TrainerCalendarComponent,
        TrainerHeaderModalComponent,
        TrainerInfoModalComponent,
        TrainerHourModalComponent,
        TrainerChangeModalComponent,
        TrainerDeleteModalComponent,

    ],
})
export class HomeModule { }
