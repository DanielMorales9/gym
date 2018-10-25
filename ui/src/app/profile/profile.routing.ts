import {UserProfileComponent} from "./components/user-profile.component";
import {TrainingComponent} from "./components/training.component";
import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {ProfileComponent} from "./components/profile.component";
import {SalesComponent} from "../home/sales/sales.component";
import {MakeSaleComponent} from "./components/sale-make.component";
import {SaleSummaryComponent} from "./components/sale-summary.component";


const routes = [
    { path: '', component: ProfileComponent, children: [
            { path: '', redirectTo: "user", pathMatch: "full"},
            { path: 'user', component: UserProfileComponent },
            { path: 'makeSale', component: MakeSaleComponent },
            { path: 'sales', component: SalesComponent },
            { path: 'summarySale/:saleId', component: SaleSummaryComponent },
            { path: 'trainings', component: TrainingComponent }
        ]},
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRouting { }
