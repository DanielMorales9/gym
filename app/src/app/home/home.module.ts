import { NgModule } from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {HomeRouting} from "./home.routing";
import {HomeComponent} from "./home.component";
import {CalendarModule, DateAdapter} from "angular-calendar";
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";
import localeIt from '@angular/common/locales/it';
import {BookingComponent} from "./booking";
import {BundleModalComponent, BundlesComponent} from "./bundles";
import {UserDetailsComponent, UsersComponent} from "./users";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared";

registerLocaleData(localeIt);


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
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
        UserDetailsComponent,
        BundlesComponent,
        BundleModalComponent,
        BookingComponent],
    exports: [],
    entryComponents: [HomeComponent]
})
export class HomeModule { }