import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

const routes: Routes = [
    { path: '', pathMatch: "full", redirectTo: "home"},
    { path: 'login', loadChildren: "app/login/login.module#LoginModule"},
    { path: 'verification', loadChildren: "app/verification/verification.module#VerificationModule"},
    { path: 'error', loadChildren: "app/error/error.module#ErrorModule"},
    { path: 'home', loadChildren: "app/home/home.module#HomeModule" },
    { path: 'profile/:id?', loadChildren: "app/profile/profile.module#ProfileModule" }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class AppRouting { }
