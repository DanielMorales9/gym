import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import 'rxjs/add/operator/finally';
import {GymService, ScreenService} from './core/utilities';
import {Subscription} from 'rxjs';
import {SideBarComponent} from './components';
import {AuthenticationService} from './core/authentication';
import {filter, throttleTime} from 'rxjs/operators';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./styles/root.css', './styles/app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

    constructor(private auth: AuthenticationService,
                private screenService: ScreenService,
                private gymService: GymService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    appName: string;
    authenticated: boolean;

    @ViewChild('sideBar', { static: true })
    public sideBar: SideBarComponent;

    private sub: Subscription = new Subscription();

    private setTitle(...title) {
        document.title = title.join(' - ');
    }

    async ngOnInit(): Promise<void> {
        this.authOnNavigation();
        await this.authenticate();
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

    private async authenticate() {
        const [data, err] = await this.auth.login();
        this.authenticated = !!data;
        if (this.authenticated) {
            await this.getAppName();
        }
    }

    private async getAppName() {
        const [data, _] = await this.auth.getGym();
        if (data) {
            this.appName = data.name;
            this.setTitle(this.appName);
        }
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    async logout() {
        await this.auth.logout();
        this.authenticated = false;
        await this.router.navigateByUrl('/auth');
        await this.sideBar.close();
    }

    private authOnNavigation() {
        const sub = this.router.events
            .pipe(filter(event => event instanceof NavigationStart))
            .subscribe(async event => {
                await this.authenticate();
                await this.closeNav();
                const titles = this.getTitle(this.router.routerState, this.router.routerState.root);
                this.setTitle(this.appName, ...titles);
        });
        this.sub.add(sub);
    }

    isDesktop() {
        return this.screenService.isDesktop();
    }

    async goHome() {
        if (this.authenticated && this.hasUser()) {
            const roleName = this.getUser().roles
                .find(value => value.id === this.getCurrentRole())
                .name.toLowerCase();
            await this.router.navigateByUrl(roleName);
        }
        else {
            await this.router.navigateByUrl('/auth');
        }
    }

    async closeNav() {
        if (!this.sideBarOpened()) {
            await this.sideBar.toggle(false);
        }
    }

    sideBarMode() {
        return !this.isDesktop() && this.authenticated ? 'over' : 'side';
    }

    sideBarOpened() {
        return this.isDesktop() && this.authenticated;
    }

    async openSideBar() {
        if (this.authenticated) {
            await this.sideBar.toggle();
        }
    }

    private getUser() {
        return this.auth.getUser();
    }

    private hasUser() {
        return this.auth.hasUser();
    }
}
