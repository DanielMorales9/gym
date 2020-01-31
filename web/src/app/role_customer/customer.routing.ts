import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CustomerCalendarComponent} from './calendar';
import {SaleDetailsComponent, SalesComponent} from '../shared/sales';
import {BundleSpecDetailsComponent} from '../shared/bundle-specs';
import {BundleDetailsComponent, BundlesCustomerComponent} from '../shared/bundles';

const routes = [
    { path: '', children : [
            { path: '', redirectTo: 'calendar', pathMatch: 'full'},
            {
                path: 'calendar', component: CustomerCalendarComponent,
                data: {title: 'Calendario' }
            },
            {
                path: 'sales', component: SalesComponent,
                data: {title: 'Ordine' }
            },
            {
                path: 'sales/:id', component: SaleDetailsComponent,
                data: {title: 'Dettaglio Vendita' }
            },
            {
                path: 'bundleSpecs/:id', component: BundleSpecDetailsComponent,
                data: {title: 'Dettaglio Tipo Pacchetto' }
            },
            {
                path: 'bundles/:id', component: BundleDetailsComponent,
                data: {title: 'Dettaglio Pacchetto' }
            },
            {
                path: 'bundles', component: BundlesCustomerComponent,
                data: {title: 'Pacchetti' }
            },
            { path: '**', redirectTo: 'calendar' }
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
