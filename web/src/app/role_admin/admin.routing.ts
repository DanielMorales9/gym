import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CreateSaleComponent} from './sales';
import {AdminCalendarComponent} from './calendar';
import {SaleDetailsComponent, SalesComponent} from '../shared/sales';
import {UserDetailsComponent, UsersComponent} from '../shared/users';
import {ACustomerCalendarComponent} from './customer-calendar';
import {BundleSpecDetailsComponent, BundleSpecsComponent} from '../shared/bundle-specs';
import {BundleDetailsComponent, BundlesCustomerComponent} from '../shared/bundles';

const routes = [

    { path: '', children : [
            { path: '', redirectTo: 'sales', pathMatch: 'full'},
            { path: 'bundleSpecs', component: BundleSpecsComponent },
            { path: 'bundleSpecs/:id', component: BundleSpecDetailsComponent },
            { path: 'bundles/:id', component: BundleDetailsComponent },
            { path: 'customer/bundles', component: BundlesCustomerComponent },
            { path: 'users', component: UsersComponent },
            { path: 'users/:id', component: UserDetailsComponent},
            { path: 'sales', component: SalesComponent },
            { path: 'sales/buy/:id', component: CreateSaleComponent },
            { path: 'sales/:id', component: SaleDetailsComponent },
            { path: 'calendar', component: AdminCalendarComponent },
            { path: 'calendar/:id', component: ACustomerCalendarComponent },
            { path: '**', redirectTo: 'bundleSpecs' }
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
