import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CustomerCalendarComponent} from './calendar';
import {SalesComponent} from './sales';
import {SaleDetailsComponent} from '../../shared/components/sales';

const routes = [
    { path: '', children : [
            { path: '', redirectTo: 'calendar', pathMatch: 'full'},
            { path: 'calendar', component: CustomerCalendarComponent },
            { path: 'sales', component: SalesComponent },
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
export class CustomerRouting { }
