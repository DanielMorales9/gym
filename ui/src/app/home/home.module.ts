import { NgModule } from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {HomeRouting} from "./home.routing";
import {HomeComponent} from "./home.component";
import {UsersComponent} from "./users/users.component";
import {BundlesComponent} from "./bundles/bundles.component";
import {BookingComponent} from "./booking/booking.component";
import {SharedModule} from "../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserDetailsComponent} from "./users/user-details.component";
import {BundleModalComponent} from "./bundles/bundle-modal.component";
import {CalendarModule, DateAdapter} from "angular-calendar";
import {CoreModule} from "../core/core.module";
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";
import localeIt from '@angular/common/locales/it';

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
        CoreModule,
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
