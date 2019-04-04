import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProfileRouting} from "./profile.routing";
import {
    SaleSummaryComponent,
    TrainingComponent, TrainingDetailsComponent
} from "./components";
import {SharedModule} from "../shared";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProfileComponent} from "./profile.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        ProfileRouting,
    ],
    declarations: [
        ProfileComponent,
        SaleSummaryComponent,
        TrainingComponent,
        TrainingDetailsComponent],
    exports: [],
    entryComponents: [ProfileComponent]
})
export class ProfileModule { }
