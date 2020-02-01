import {
    Component,
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef, EventEmitter,
    Input, OnDestroy,
    OnInit, Output,
    Type,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, NavigationStart, Router} from '@angular/router';
import {ISubscription} from 'rxjs-compat/Subscription';

@Component({
    selector: 'nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['../styles/root.css', '../styles/app.component.css'],
})
export class NavBarComponent implements OnInit, OnDestroy {

    @Input() authenticated: boolean;
    @Input() appName: string;
    @Input() isMobile: boolean;

    @Output() logout = new EventEmitter();
    @Output() home = new EventEmitter();
    @Output() snav = new EventEmitter();

    title: string;
    sub: ISubscription;

    // @ViewChild('primaryControls', {static: true, read: ViewContainerRef})
    // primaryControls: ViewContainerRef;
    // primaryControlComponents: ComponentRef<Component>[] = new Array<ComponentRef<Component>>();

    constructor(private router: Router,
                private route: ActivatedRoute,
                private componentFactoryResolver: ComponentFactoryResolver) {}

    ngOnInit(): void {
        this.title = this.appName;
        this.sub = this.router.events.subscribe((event) => {
            // if (event instanceof NavigationEnd) {
            //     this.updatePrimaryControls(this.router.routerState.snapshot.root);
            // }
            if (event instanceof NavigationEnd) {
                const titles = this.getTitle(this.router.routerState, this.router.routerState.root);
                this.setTitle(...titles, this.appName);
            }
        });
    }

    private setTitle(...titles) {
        this.title = titles[0];
    }

    private getTitle(state, parent) {
        const data = [];
        if (parent && parent.snapshot.data && parent.snapshot.data.title) {
            data.push(parent.snapshot.data.title);
        }

        if (state && parent) {
            data.push(... this.getTitle(state, state.firstChild(parent)));
        }
        return data;
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    // private updatePrimaryControls(snapshot: ActivatedRouteSnapshot): void {
    //     this.clearPrimaryControls();
    //     const primary: any = snapshot.data.nav;
    //     if (primary instanceof Type) {
    //         const factory: ComponentFactory<Component> = this.componentFactoryResolver.resolveComponentFactory(primary);
    //         const componentRef: ComponentRef<Component> = this.primaryControls.createComponent(factory);
    //         this.primaryControlComponents.push(componentRef);
    //     }
    //     for (const childSnapshot of snapshot.children) {
    //         this.updatePrimaryControls(childSnapshot);
    //     }
    // }
    //
    // private clearPrimaryControls() {
    //     if (this.primaryControls) { this.primaryControls.clear(); }
    //     for (const toolbarComponent of this.primaryControlComponents) {
    //         toolbarComponent.destroy();
    //     }
    // }

    openSideBar() {
        this.snav.emit();
    }

    hideLogin() {
        return this.router.url.startsWith('/auth') || this.authenticated;
    }

    hideLogout() {
        return !this.authenticated;
    }

    doLogout() {
        this.logout.emit();
    }

    goHome() {
        this.home.emit();
    }
}
