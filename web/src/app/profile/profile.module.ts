import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProfileRouting} from "./profile.routing";
import {
    TrainingComponent, TrainingDetailsComponent
} from "./components";
import {SharedModule} from "../shared";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        ProfileRouting,
    ],
    declarations: [
        TrainingComponent,
        TrainingDetailsComponent],
})
export class ProfileModule { }
