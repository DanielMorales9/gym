import {Component, NgModule} from '@angular/core';
import {RouterModule} from "@angular/router";
import {BundlesComponent} from "./bundles";
import {UserDetailsComponent, UsersComponent} from './users';
import {SalesComponent} from "../../shared/components/sales";
import {CreateSaleComponent} from './sales';

const routes = [

    { path: '', children : [
            { path: '', redirectTo: 'sales', pathMatch: "full"},
            { path: 'bundles', component: BundlesComponent },
            { path: 'users', component: UsersComponent },
            { path: 'users/:id', component: UserDetailsComponent},
            { path: 'sales', component: SalesComponent },
            { path: 'buy/:id', component: CreateSaleComponent },
            { path: '**', redirectTo: 'bundles' }
        ]},
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AdminRouting { }
