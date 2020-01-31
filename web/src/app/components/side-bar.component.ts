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
    selector: 'side-nav',
    templateUrl: './side-bar.component.html',
    styleUrls: ['../styles/root.css', '../styles/app.component.css'],
})
export class SideBarComponent implements OnInit, OnDestroy {

    @Input() id: number;
    @Input() current_role_view: number;
    @Input() opened: boolean;
    @Input() mode: string;
    @Input() appName: string;
    @Input() isMobile: boolean;

    @ViewChild('sideNav', { static: true })
    public sideNav: MatSidenav;

    @ViewChild('primaryControls', {static: false, read: ViewContainerRef})
    primaryControls: ViewContainerRef;

    controlComponents: ComponentRef<Component>[] = new Array<ComponentRef<Component>>();
    routerEventSubscription: ISubscription;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private componentFactoryResolver: ComponentFactoryResolver) {}

    ngOnInit(): void {
        this.routerEventSubscription = this.router.events.subscribe((event) => {
                if (event instanceof NavigationEnd) {
                    this.updatePrimaryControls(this.router.routerState.snapshot.root);
                }
            }
        );
    }

    ngOnDestroy(): void {
        this.routerEventSubscription.unsubscribe();
    }

    private updatePrimaryControls(snapshot: ActivatedRouteSnapshot): void {
        this.clearPrimaryControls();
        const primary: any = snapshot.data.primary;
        if (primary instanceof Type) {
            const factory: ComponentFactory<Component> = this.componentFactoryResolver.resolveComponentFactory(primary);
            const componentRef: ComponentRef<Component> = this.primaryControls.createComponent(factory);
            this.controlComponents.push(componentRef);
        }
        for (const childSnapshot of snapshot.children) {
            this.updatePrimaryControls(childSnapshot);
        }
    }

    private clearPrimaryControls() {
        this.primaryControls.clear();
        for (const toolbarComponent of this.controlComponents) {
            toolbarComponent.destroy();
        }
    }

    isOnCalendar() {
        return this.router.url.includes('calendar');
    }

    async goToView(view?) {
        const params = Object.assign({}, this.route.snapshot.queryParams);
        if (!!view) {
            params['view'] = view;
        }
        else {
            params['viewDate'] = new Date();
        }
        const url = this.router.url.split('?')[0];
        await this.router.navigate([], {
            relativeTo: this.route,
            queryParams: params,
        });
    }

    async toggle(b?: boolean) {
        await this.sideNav.toggle(b);
    }

    async close() {
        await this.sideNav.close();
    }
}
