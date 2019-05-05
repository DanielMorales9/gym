import {Component, OnInit, ViewChild} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import 'rxjs/add/operator/finally';
import {AppService, AuthenticatedService} from './services';
import {User} from './shared/model';
import {UserHelperService} from './shared/services';
import {MatSidenav} from '@angular/material';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./styles/root.css', './app.component.css']
})
export class AppComponent implements OnInit {

    current_role_view: number;
    authenticated: boolean;

    profilePath: string;
    user: User;
    appName = 'Goodfellas';
    screenWidth: number;
    @ViewChild('snav') public snav: MatSidenav;


    constructor(private service: AppService,
                private router: Router,
                private authenticatedService: AuthenticatedService) {
    }


    ngOnInit(): void {
        this.authOnNavigation();

        this.authenticatedService.getAuthenticated().subscribe(auth => {
            this.authenticated = auth;

            if (this.authenticated && !this.user) {
                this.current_role_view = this.service.currentRole;
                this.user = this.service.user;
                this.profilePath = `profile/${this.user.id}/user`;
            }

        });

        this.screenWidth = window.innerWidth;
        window.onresize = (_) => {
            this.screenWidth = window.innerWidth;
        };
    }

    logout() {
        this.service.logout(() => {
            this.snav.close();
            this.current_role_view = undefined;
            this.authenticated = false;
            this.user = undefined;
            return this.router.navigateByUrl('/auth/login');
        });
    }

    private authOnNavigation() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.service.authenticate();
            }
        });
    }

    toHome() {
        if (!this.isOnHome()) {
            this.router.navigateByUrl('/home');
        }
    }

    hasRoles() {
        if (!!this.user && !!this.user.roles) {
            return this.user.roles && this.user.roles.length > 1;
        }
        return false;
    }

    hideLogin() {
        return this.router.url.startsWith('/auth') || this.authenticated;
    }

    hideLogout() {
        return !this.authenticated;
    }

    isOnHome() {
        return this.router.url.startsWith('/home');
    }

    isOnProfile() {
        return this.router.url.startsWith('/profile');
    }

    isOnLogin() {
        return this.router.url.startsWith('/auth');
    }
}
