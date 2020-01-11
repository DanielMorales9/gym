import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {BundleSpecsComponent} from './bundle-specs';
import {CreateSaleComponent} from './sales';
import {AdminCalendarComponent} from './calendar';
import {SaleDetailsComponent, SalesComponent} from '../shared/components/sales';
import {UserDetailsComponent, UsersComponent} from '../shared/components/users';
import {ACustomerCalendarComponent} from './customer-calendar';
import {BundleSpecDetailsComponent} from '../shared/components/bundle-specs';
import {BundlesComponent} from './bundles';
import {BundleDetailsComponent} from '../shared/components/bundles';

const routes = [

    { path: '', children : [
            { path: '', redirectTo: 'sales', pathMatch: 'full'},
            { path: 'bundleSpecs', component: BundleSpecsComponent },
            { path: 'bundleSpecs/:id', component: BundleSpecDetailsComponent },
            { path: 'bundles', component: BundlesComponent },
            { path: 'bundles/:id', component: BundleDetailsComponent },
            { path: 'users', component: UsersComponent },
            { path: 'users/:id', component: UserDetailsComponent},
            { path: 'sales', component: SalesComponent },
            { path: 'sales/buy/:id', component: CreateSaleComponent },
            { path: 'sales/:id', component: SaleDetailsComponent },
            { path: 'calendar', component: AdminCalendarComponent },
            { path: 'calendar/customer/:id', component: ACustomerCalendarComponent },
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
