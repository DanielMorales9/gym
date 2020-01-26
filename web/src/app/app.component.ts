import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import 'rxjs/add/operator/finally';
import {AppService, GymService} from './services';
import {User} from './shared/model';
import {MatSidenav} from '@angular/material';
import {ScreenService} from './core/utilities';
import {Subscription} from 'rxjs';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./styles/root.css', './app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

    current_role_view: number;
    authenticated: boolean;

    user: User;
    appName = '';
    @ViewChild('snav', { static: true }) public snav: MatSidenav;
    opened = this.shouldBeOpen();
    private sub: Subscription = new Subscription();

    constructor(private service: AppService,
                private screenService: ScreenService,
                private router: Router,
                private route: ActivatedRoute,
                private gymService: GymService) {
    }


    async ngOnInit(): Promise<void> {
        this.authOnNavigation();
        const [data, error] = await this.service.authenticate();
        await this.onAuthenticate(data);
    }

    private async onAuthenticate(authenticated: any) {
        this.authenticated = authenticated;
        if (this.authenticated && !this.user) {
            this.current_role_view = this.service.currentRole;
            this.user = this.service.user;
            const [data, error] = await this.gymService.getConfig();
            if (data) {
                this.appName = data.name;
                document.title = this.appName;
            }
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
        await this.snav.close();
    }

    private authOnNavigation() {
        let sub = this.router.events.subscribe(async event => {
            if (event instanceof NavigationStart) {
                const [data, error] = await this.service.authenticate();
                await this.onAuthenticate(data);
                await this.closeNav();
            }
        });
        this.sub.add(sub);
        sub = this.route.queryParams.subscribe(params => {
            if ('title' in params) {
                document.title = params['title'];
            }
            else {
                document.title = this.appName;
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

    async closeNav() {
        if (!this.shouldBeOpen()) {
            await this.snav.toggle(false);
        }
    }

    private shouldBeOpen() {
        return this.isDesktop() && this.authenticated;
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
}
