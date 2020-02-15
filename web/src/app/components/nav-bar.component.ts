import {Component, ComponentFactoryResolver, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {ISubscription} from 'rxjs-compat/Subscription';
import {Location} from '@angular/common';

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
    isBack: boolean;
    sub: ISubscription;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private location: Location,
                private componentFactoryResolver: ComponentFactoryResolver) {}

    ngOnInit(): void {
        this.title = this.appName;
        this.sub = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.isBack = this.getBack(this.router.routerState, this.router.routerState.root);
                const titles = this.getTitle(this.router.routerState, this.router.routerState.root);
                this.setTitle(...titles, this.appName);
            }
        });
    }

    private setTitle(...titles) {
        if (this.isMobile) {
            this.title = titles[0];
        }
        else {
            this.title = titles.filter(value => !!value).reverse().join(' | ');
        }
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

    private getBack(state, parent) {

        if (parent && parent.snapshot.data && parent.snapshot.data.back) {
            return parent.snapshot.data.back;
        }

        if (state && parent) {
            return this.getBack(state, state.firstChild(parent));
        }

    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }


    openSideBar() {
        this.snav.emit();
    }

    hideLogin() {
        return this.authenticated || (!this.router.url.startsWith('/auth/home') && this.router.url.startsWith('/auth') );
    }

    hide() {
        return !this.authenticated;
    }

    doLogout() {
        this.logout.emit();
    }

    goHome() {
        this.home.emit();
    }

    back() {
        this.location.back();
    }
}
