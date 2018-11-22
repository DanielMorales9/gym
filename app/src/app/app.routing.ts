import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

const routes: Routes = [
    { path: '', pathMatch: "full", redirectTo: "home"},
    { path: 'auth', loadChildren: "app/auth/auth.module#AuthModule"},
    { path: 'error', loadChildren: "app/error/error.module#ErrorModule"},
    { path: 'home', loadChildren: "app/home/home.module#HomeModule" },
    { path: 'profile/:id?', loadChildren: "app/profile/profile.module#ProfileModule" },
    { path: '**', redirectTo: 'home' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class AppRouting { }
