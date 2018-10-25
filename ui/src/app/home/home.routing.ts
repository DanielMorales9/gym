import { NgModule } from '@angular/core';
import {RouterModule} from "@angular/router";
import {HomeComponent} from "./home.component";
import {UsersComponent} from "./users/users.component";
import {SalesComponent} from "./sales/sales.component";
import {BundlesComponent} from "./bundles/bundles.component";
import {BookingComponent} from "./booking/booking.component";

const routes = [

    { path: '', component: HomeComponent, children : [
            { path: '', redirectTo: 'booking', pathMatch: "full"},
            { path: 'users', component: UsersComponent },
            { path: 'sales', component: SalesComponent },
            { path: 'bundles', component: BundlesComponent },
            { path: 'booking', component: BookingComponent }
        ]},
];
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class HomeRouting { }
