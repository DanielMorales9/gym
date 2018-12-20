import { NgModule } from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {HomeRouting} from "./home.routing";
import {HomeComponent} from "./home.component";
import {CalendarModule, DateAdapter} from "angular-calendar";
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";
import localeIt from '@angular/common/locales/it';
import {
    AdminCalendarComponent, AdminDeleteModalComponent, AdminHeaderModalComponent, AdminInfoModalComponent,
    CalendarComponent,
    CustomerCalendarComponent,
    CustomerDeleteModalComponent,
    CustomerHourModalComponent, CustomerInfoModalComponent
} from "./calendar";
import {BundleModalComponent, BundlesComponent} from "./bundles";
import {UserCreateModalComponent, UserDetailsComponent, UsersComponent} from "./users";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared";

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
    ],

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
        AdminInfoModalComponent,
        AdminHeaderModalComponent,
        AdminDeleteModalComponent
    ],
})
export class HomeModule { }
