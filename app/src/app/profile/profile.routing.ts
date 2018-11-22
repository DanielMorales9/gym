import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {
    MakeSaleComponent,
    ProfileComponent,
    SaleSummaryComponent,
    TrainingComponent,
    UserProfileComponent
} from "./components";
import {SalesComponent} from "../shared/components/sales";


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
