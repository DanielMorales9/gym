import { NgModule } from '@angular/core';
import {ErrorComponent} from "./error.component";
import {RouterModule} from "@angular/router";

const routes = [
    { path: '', pathMatch: 'full', component: ErrorComponent },
];
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class ErrorRouting { }
