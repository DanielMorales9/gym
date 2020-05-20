import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import 'rxjs/add/operator/finally';
import {GymService, ScreenService} from './core/utilities';
import {Observable, Subscription} from 'rxjs';
import {SideBarComponent} from './components';
import {AuthenticationService} from './core/authentication';
import {filter, map, switchMap, takeUntil, throttleTime} from 'rxjs/operators';
import {BaseComponent} from './shared/base-component';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./styles/root.css', './styles/app.component.css']
})
export class AppComponent extends BaseComponent implements OnInit, OnDestroy {

    constructor(private auth: AuthenticationService,
                private screenService: ScreenService,
                private gymService: GymService,
                private router: Router,
                private route: ActivatedRoute) {
        super();
    }

    appName: string;
    authenticated: boolean;

    @ViewChild('sideBar', { static: true })
    public sideBar: SideBarComponent;

    private setTitle(...title) {
        document.title = title.join(' - ');
    }

    ngOnInit(): void {
        this.authOnNavigation();
        this.authenticate();
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

    private getCurrentRole() {
        return this.auth.getCurrentUserRole();
    }

    private authenticate() {
        return this.auth.login()
            .pipe(map(data => {
                    this.authenticated = !!data;
                    return data;
                }
        ));
    }

    private getAppName(): Observable<any> {
        return this.auth.getGym()
            .pipe(
                map(data => {
                if (!!data) {
                    this.appName = data.name;
                    this.setTitle(this.appName);
                }
                return data;
            }));
    }

    logout() {
        this.auth.logout()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
            _ => {
                this.authenticated = false;
                this.router.navigateByUrl('/auth');
                this.sideBar.close();
            }
        );
    }

    private authOnNavigation() {
        this.router.events
            .pipe(
                takeUntil(this.unsubscribe$),
                filter(event => event instanceof NavigationStart),
                switchMap(s => this.authenticate()),
                switchMap(s => this.getAppName())
            )
            .subscribe(_ => {
                this.closeNav();
                const titles = this.getTitle(this.router.routerState, this.router.routerState.root);
                this.setTitle(this.appName, ...titles);
        });
    }

    isDesktop() {
        return this.screenService.isDesktop();
    }

    goHome() {
        if (this.authenticated && this.hasUser()) {
            const roleName = this.getUser().roles
                .find(value => value.id === this.getCurrentRole())
                .name.toLowerCase();
            this.router.navigateByUrl(roleName);
        }
        else {
            this.router.navigateByUrl('/auth');
        }
    }

    closeNav() {
        if (!this.sideBarOpened()) {
            this.sideBar.toggle(false);
        }
    }

    sideBarMode() {
        return !this.isDesktop() && this.authenticated ? 'over' : 'side';
    }

    sideBarOpened() {
        return this.isDesktop() && this.authenticated;
    }

    openSideBar() {
        if (this.authenticated) {
            this.sideBar.toggle();
        }
    }

    private getUser() {
        return this.auth.getUser();
    }

    private hasUser() {
        return this.auth.hasUser();
    }
}
