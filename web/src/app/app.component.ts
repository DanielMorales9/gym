import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';

import {ScreenService} from './core/utilities';
import {interval, Observable, of} from 'rxjs';
import {SideBarComponent} from './components';
import {AuthenticationService} from './core/authentication';
import {filter, map, switchMap, takeUntil} from 'rxjs/operators';
import {BaseComponent} from './shared/base-component';
import {Gym} from './shared/model';
import {SwUpdate} from '@angular/service-worker';
import {environment} from '../environments/environment.prod';
import { version } from '../../package.json';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./styles/root.css', './styles/app.component.css']
})
export class AppComponent extends BaseComponent implements OnInit, OnDestroy {

    appName: string;
    authenticated: boolean;
    isBack: boolean;
    desktop: boolean;
    title: string[];
    version: string = version;


    constructor(private auth: AuthenticationService,
                private screenService: ScreenService,
                private router: Router,
                private swUpdate: SwUpdate) {
        super();
    }

    @ViewChild('sideBar', { static: true })
    public sideBar: SideBarComponent;

    private setTitle(...title) {
        title = title.filter(v => !!v);
        this.title = title;
        document.title = title.join(' - ');
    }

    ngOnInit(): void {
        console.log(`App Version: ${version}`)
        this.authOnNavigation();
        this.authenticate();
        this.desktop = this.isDesktop();

        this.checkUpdates();
    }

    private checkUpdates() {
        if (this.swUpdate.isEnabled) {
            console.log("Check for updates is running every minute...")
            this.swUpdate.available
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(_ => {
                    if (confirm('Aggiornamento disponibile. ' +
                        'Vuoi ricaricare la pagina per ottenere la nuova versione?')) {
                        this.swUpdate.activateUpdate().then(() => {
                            window.location.reload();
                        });
                    }
                });

            interval(1000 * 60).subscribe(() => {
                this.swUpdate.checkForUpdate();
            });

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


    private authenticate() {
        return this.auth.authenticate()
            .pipe(
                map(data => {
                    this.authenticated = !!data;
                    return data;
                }),
                switchMap(v => this.auth.getUserDetails(v)));
    }

    private getAppName(v): Observable<any> {
        if (!this.appName) {
            return this.auth.getGym().pipe(map((data: Gym) => {
                if (!!data) {
                    this.appName = data.name;
                    this.title = [this.appName];
                    this.setTitle(this.appName);
                }
                return data;
            }));
        }
        return of(v);
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
                map(v => {
                    this.closeNav();
                    return v;
                }),
                switchMap(s => this.authenticate()),
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

    isDesktop() {
        return this.screenService.isDesktop();
    }

    goHome() {
        if (this.authenticated && this.hasUser()) {
            this.router.navigateByUrl(this.auth.getUserRoleName());
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
        return this.desktop && this.authenticated;
    }

    openSideBar() {
        if (this.authenticated) {
            this.sideBar.toggle();
        }
    }

    private hasUser() {
        return this.auth.hasUser();
    }
}
