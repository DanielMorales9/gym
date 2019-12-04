import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {
    TrainingComponent,
} from "./components";

const routes = [
    { path: '', children: [
            { path: '', redirectTo: "user", pathMatch: "full"},
            { path: 'trainings', component: TrainingComponent }
        ]},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRouting { }
