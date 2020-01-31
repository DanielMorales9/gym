import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import 'rxjs/add/operator/finally';
import {AppService, GymService} from './services';
import {User} from './shared/model';
import {ScreenService} from './core/utilities';
import {Subscription} from 'rxjs';
import {SideBarComponent} from './components';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./styles/root.css', './styles/app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

    constructor(private service: AppService,
                private screenService: ScreenService,
                private router: Router,
                private route: ActivatedRoute,
                private gymService: GymService) {
    }

    user: User;
    appName: string;
    authenticated: boolean;
    current_role_view: number;

    @ViewChild('sideBar', { static: true })
    public sideBar: SideBarComponent;

    private sub: Subscription = new Subscription();

    async ngOnInit(): Promise<void> {
        this.authOnNavigation();
        await this.authenticate();
    }

    // noinspection JSMethodCanBeStatic
    private setTitle(...title) {
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

    private async authenticate() {
        const [authenticated, _] = await this.service.authenticate();
        this.authenticated = authenticated;
        if (this.authenticated && !this.user) {
            this.current_role_view = this.service.currentRole;
            this.user = this.service.user;
            await this.getGymName();
        }
    }

    private async getGymName() {
        const [data, _] = await this.gymService.getConfig();
        if (data) {
            this.appName = data.name;
            this.setTitle(this.appName);
        }
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    async logout() {
        await this.service.logout();
        this.authenticated = false;
        this.user = undefined;
        this.current_role_view = undefined;
        await this.router.navigateByUrl('/home');
        await this.sideBar.close();
    }

    private authOnNavigation() {
        const sub = this.router.events.subscribe(async event => {
            if (event instanceof NavigationStart) {
                await this.authenticate();
                await this.closeNav();
                const titles = this.getTitle(this.router.routerState, this.router.routerState.root);
                this.setTitle(this.appName, ...titles);
            }
        });
        this.sub.add(sub);
    }

    hideLogin() {
        return this.router.url.startsWith('/auth') || this.authenticated;
    }

    hideLogout() {
        return !this.authenticated;
    }

    isDesktop() {
        return this.screenService.isDesktop();
    }

    async goHome() {
        const roleName = this.user.roles
            .find(value => value.id === this.current_role_view)
            .name.toLowerCase();
        await this.router.navigateByUrl(roleName);
    }

    async closeNav() {
        if (!this.sideBarOpened()) {
            await this.sideBar.toggle(false);
        }
    }

    private sideBarMode() {
        return !this.isDesktop() && this.authenticated ? 'over' : 'side';
    }

    private sideBarOpened() {
        return this.isDesktop() && this.authenticated;
    }

    async openSideBar() {
        if (this.authenticated) {
            await this.sideBar.toggle();
        }
    }
}
