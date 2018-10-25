import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProfileComponent} from "./components/profile.component";
import {ProfileRouting} from "./profile.routing";
import {UserProfileComponent} from "./components/user-profile.component";
import {TrainingComponent} from "./components/training.component";
import {TrainingDetailsComponent} from "./components/training-details.component";
import {CoreModule} from "../core/core.module";
import {MakeSaleComponent} from "./components/sale-make.component";
import {SharedModule} from "../shared/shared.module";
import {SaleSummaryComponent} from "./components/sale-summary.component";
import {FormsModule} from "@angular/forms";
import {HomeModule} from "../home/home.module";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
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
