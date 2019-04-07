import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {BundleDetailsComponent, BundlesComponent} from './bundles';
import {UserDetailsComponent, UsersComponent} from './users';
import {CreateSaleComponent, SaleDetailsComponent, SalesComponent} from './sales';

const routes = [

    { path: '', children : [
            { path: '', redirectTo: 'sales', pathMatch: "full"},
            { path: 'bundles', component: BundlesComponent },
            { path: 'bundles/:id', component: BundleDetailsComponent },
            { path: 'users', component: UsersComponent },
            { path: 'users/:id', component: UserDetailsComponent},
            { path: 'sales', component: SalesComponent },
            { path: 'sales/buy/:id', component: CreateSaleComponent },
            { path: 'sales/:id', component: SaleDetailsComponent },
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
