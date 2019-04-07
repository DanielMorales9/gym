import {NgModule} from '@angular/core';
import {RouterModule} from "@angular/router";
import {HomeComponent} from "./home.component";
import {CalendarComponent} from "./calendar";

const routes = [

    { path: '', component: HomeComponent, children : [
            { path: '', redirectTo: 'calendar', pathMatch: "full"},
            { path: 'calendar', component: CalendarComponent },
            { path: '**', redirectTo: 'calendar' }
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
