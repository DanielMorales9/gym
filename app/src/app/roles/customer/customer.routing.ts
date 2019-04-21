import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CustomerCalendarComponent} from './calendar';
import {SalesComponent} from './sales';
import {SaleDetailsComponent} from '../../shared/components/sales';
import {BundleDetailsComponent} from '../../shared/components/bundles';

const routes = [
    { path: '', children : [
            { path: '', redirectTo: 'calendar', pathMatch: 'full'},
            { path: 'calendar', component: CustomerCalendarComponent },
            { path: 'sales', component: SalesComponent },
            { path: 'sales/:id', component: SaleDetailsComponent },
            { path: 'bundles/:id', component: BundleDetailsComponent },
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
export class CustomerRouting { }
