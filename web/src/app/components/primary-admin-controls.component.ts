import {
    Component,
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    Input, OnDestroy,
    OnInit,
    Type,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';
import {MatSidenav} from '@angular/material/sidenav';
import {ISubscription} from 'rxjs-compat/Subscription';

@Component({
    templateUrl: './primary-admin-controls.component.html',
    styleUrls: ['../styles/root.css', '../styles/app.component.css'],
})
export class PrimaryAdminControlsComponent {

}
