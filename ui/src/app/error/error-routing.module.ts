import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ErrorComponent} from "./error.component";
import {RouterModule} from "@angular/router";

const routes = [
    { path: '', component: ErrorComponent },
];
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class ErrorRoutingModule { }
