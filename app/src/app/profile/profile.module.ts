import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProfileRouting} from "./profile.routing";
import {
    MakeSaleComponent,
    SaleSummaryComponent,
    TrainingComponent, TrainingDetailsComponent,
    UserProfileComponent
} from "./components";
import {SharedModule} from "../shared";
import {FormsModule} from "@angular/forms";
import {ProfileComponent} from "./profile.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ProfileRouting
    ],
    declarations: [
        ProfileComponent,
        UserProfileComponent,
        MakeSaleComponent,
        SaleSummaryComponent,
        TrainingComponent,
        TrainingDetailsComponent],
    exports: [],
    entryComponents: [ProfileComponent]
})
export class ProfileModule { }
