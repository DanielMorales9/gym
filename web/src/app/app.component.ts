import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';

import {ScreenService} from './core';
import {Observable, of} from 'rxjs';
import {SideBarComponent} from './components';
import {AuthenticationService} from './core';
import {filter, map, switchMap, takeUntil} from 'rxjs/operators';
import {BaseComponent} from './shared/base-component';
import {Gym} from './shared/model';
import { version } from '../../package.json';
import {AppUpdateService} from './services';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./styles/root.css', './styles/app.component.css']
})
export class AppComponent extends BaseComponent implements OnInit, OnDestroy {

    appName: string;
    isBack: boolean;
    desktop: boolean;
    title: string[];
    version: string = version;

    @ViewChild('sideBar', { static: true })
    public sideBar: SideBarComponent;

    constructor(private auth: AuthenticationService,
                private screenService: ScreenService,
                private appUpdateService: AppUpdateService,
                private router: Router) {
        super();
    }

    ngOnInit(): void {
        console.log(`App Version: ${version}`);
        this.authOnNavigation();
        this.desktop = this.screenService.isDesktop();
    }

    private setTitle(...title) {
        title = title.filter(v => !!v);
        this.title = title;
        document.title = title.join(' - ');
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


    private authenticate() {
        return this.auth.authenticate()
            .pipe(
                switchMap(principal => this.auth.getUserDetails(principal))
            );
    }

    private getAppName(gym: any): Observable<any> {
        if (!this.appName) {
            return this.auth.findGym()
                .pipe(map((data: Gym) => {
                if (!!data) {
                    this.appName = data.name;
                    this.title = [this.appName];
                    this.setTitle(this.appName);
                }
                return data;
            }));
        }
        return of(gym);
    }

    logout() {
        this.auth.logout()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                _ => {
                    this.router.navigateByUrl('/auth');
                    this.sideBar.close();
                }
            );
    }

    private authOnNavigation() {
        this.authenticate();
        this.router.events
            .pipe(
                takeUntil(this.unsubscribe$),
                filter(event => event instanceof NavigationStart),
                map(_ => this.closeNav()),
                switchMap(_ => this.authenticate()),
                switchMap(s => this.getAppName(s))
            )
            .subscribe(_ => {
                this.isBack = this.getBack(this.router.routerState, this.router.routerState.root);
                const titles = this.getTitle(this.router.routerState, this.router.routerState.root);
                this.setTitle(this.appName, ...titles);
            });
    }

    private getBack(state, parent) {

        if (parent && parent.snapshot.data && parent.snapshot.data.back) {
            return parent.snapshot.data.back;
        }

        if (state && parent) {
            return this.getBack(state, state.firstChild(parent));
        }

    }

    goHome() {
        if (this.isAuthenticated()) {
            this.auth.navigateByRole();
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

    sideBarOpened() {
        return this.desktop && this.isAuthenticated();
    }

    openSideBar() {
        if (this.isAuthenticated()) {
            this.sideBar.toggle();
        }
    }

    isAuthenticated() {
        return this.auth.isAuthenticated();
    }
}
