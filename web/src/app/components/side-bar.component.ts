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

    @Input() opened: boolean;
    @Input() mode: string;
    @Input() appName: string;
    @Input() isMobile: boolean;

    routerEventSubscription: ISubscription;

    @ViewChild('sideNav', { static: true })
    public sideNav: MatSidenav;

    @ViewChild('primaryControls', {static: true, read: ViewContainerRef})
    primaryControls: ViewContainerRef;
    primaryControlComponents: ComponentRef<Component>[] = new Array<ComponentRef<Component>>();

    @ViewChild('secondaryControls', {static: false, read: ViewContainerRef})
    secondaryControls: ViewContainerRef;
    secondaryControlComponents: ComponentRef<Component>[] = new Array<ComponentRef<Component>>();

    constructor(private router: Router,
                private route: ActivatedRoute,
                private componentFactoryResolver: ComponentFactoryResolver) {}

    ngOnInit(): void {
        this.routerEventSubscription = this.router.events.subscribe((event) => {
                if (event instanceof NavigationEnd) {
                    this.updatePrimaryControls(this.router.routerState.snapshot.root);
                    this.updateSecondaryControls(this.router.routerState.snapshot.root);
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
            this.primaryControlComponents.push(componentRef);
        }
        for (const childSnapshot of snapshot.children) {
            this.updatePrimaryControls(childSnapshot);
        }
    }

    private clearPrimaryControls() {
        this.primaryControls.clear();
        for (const toolbarComponent of this.primaryControlComponents) {
            toolbarComponent.destroy();
        }
    }

    private updateSecondaryControls(snapshot: ActivatedRouteSnapshot): void {
        this.clearSecondaryControls();
        const secondary: any = snapshot.data.secondary;
        if (secondary instanceof Type) {
            const factory: ComponentFactory<Component> = this.componentFactoryResolver.resolveComponentFactory(secondary);
            const componentRef: ComponentRef<Component> = this.secondaryControls.createComponent(factory);
            this.secondaryControlComponents.push(componentRef);
        }
        for (const childSnapshot of snapshot.children) {
            this.updateSecondaryControls(childSnapshot);
        }
    }

    private clearSecondaryControls() {
        this.secondaryControls.clear();
        for (const toolbarComponent of this.secondaryControlComponents) {
            toolbarComponent.destroy();
        }
    }

    async toggle(b?: boolean) {
        await this.sideNav.toggle(b);
    }

    async close() {
        await this.sideNav.close();
    }
}
