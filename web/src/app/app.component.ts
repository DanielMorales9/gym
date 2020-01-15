import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import 'rxjs/add/operator/finally';
import {AppService, AuthenticatedService, GymService} from './services';
import {Gym, User} from './shared/model';
import {MatSidenav} from '@angular/material';
import {ScreenService} from './core/utilities';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./styles/root.css', './app.component.css']
})
export class AppComponent implements OnInit {

    current_role_view: number;
    authenticated: boolean;

    user: User;
    appName = '';
    @ViewChild('snav') public snav: MatSidenav;
    opened = this.shouldBeOpen();

    constructor(private service: AppService,
                private screenService: ScreenService,
                private router: Router,
                private route: ActivatedRoute,
                private gymService: GymService,
                private authenticatedService: AuthenticatedService) {
    }


    async ngOnInit(): Promise<void> {
        this.authOnNavigation();
        await this.service.authenticate();

        this.authenticatedService.getAuthenticated().subscribe(async auth => {
            this.authenticated = auth;

            if (this.authenticated && !this.user) {
                this.current_role_view = this.service.currentRole;
                this.user = this.service.user;
                const [data, error] = await this.gymService.getConfig();
                if (error) {
                    throw error;
                }
                else {
                    this.appName = data.name;
                    document.title = this.appName;
                }
            }

        });


    }

    async logout() {
        const [_, error] = await this.service.logout();

        await this.snav.close();
        this.current_role_view = undefined;
        this.authenticated = false;
        this.user = undefined;
        await this.router.navigateByUrl('/auth/login');
    }

    private authOnNavigation() {
        this.router.events.subscribe(async event => {
            if (event instanceof NavigationStart) {
                await this.service.authenticate();
            }
        });
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

    getRole() {
        return this.service;
    }

    async closeNav() {
        if (!this.shouldBeOpen()) {
            await this.snav.toggle();
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
        await this.closeNav();
        const url = this.router.url.split('?')[0];
        await this.router.navigate([], {
            relativeTo: this.route,
            queryParams: params,
        });
    }
}
