import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {BundleDetailsComponent, BundlesComponent} from './bundles';
import {UserDetailsComponent, UsersComponent} from './users';
import {CreateSaleComponent, SalesComponent} from './sales';
import {AdminCalendarComponent} from './calendar';
import {SaleDetailsComponent} from '../../shared/components/sales';

const routes = [

    { path: '', children : [
            { path: '', redirectTo: 'sales', pathMatch: 'full'},
            { path: 'bundles', component: BundlesComponent },
            { path: 'bundles/:id', component: BundleDetailsComponent },
            { path: 'users', component: UsersComponent },
            { path: 'users/:id', component: UserDetailsComponent},
            { path: 'sales', component: SalesComponent },
            { path: 'sales/buy/:id', component: CreateSaleComponent },
            { path: 'sales/:id', component: SaleDetailsComponent },
            { path: 'calendar', component: AdminCalendarComponent },
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
