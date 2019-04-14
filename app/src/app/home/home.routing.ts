import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HomeComponent} from './home.component';

const routes = [

    { path: '', component: HomeComponent, children : [
            { path: '', redirectTo: 'calendar', pathMatch: 'full'},
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
export class HomeRouting { }
