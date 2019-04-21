import {Component, OnInit} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import 'rxjs/add/operator/finally';
import {AppService, AuthenticatedService, ChangeViewService} from './services';
import {User} from './shared/model';
import {UserHelperService} from './shared/services';


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

    constructor(private service: AppService,
                private router: Router,
                private authenticatedService: AuthenticatedService,
                private userHelperService: UserHelperService,
                private changeViewService: ChangeViewService) {
    }


    ngOnInit(): void {
        this.user = new User();
        this.authOnNavigation();

        this.authenticatedService.getAuthenticated().subscribe(auth => {
            this.authenticated = auth;

            if (this.authenticated) {
                this.current_role_view = this.service.currentRole;
                this.user = this.service.user;
                this.userHelperService.getUserByEmail(this.user.email, u => {
                    this.profilePath = `profile/${u.id}/user`;
                });
            }

        });

        this.changeViewService.getView().subscribe(value => {
            this.current_role_view = value;
        });

        this.screenWidth = window.innerWidth;
        window.onresize = (_) => {
            this.screenWidth = window.innerWidth;
        };
    }

    logout() {
        this.service.logout(() => {
            this.current_role_view = undefined;
            this.authenticated = false;
            this.user = undefined;
            return this.router.navigateByUrl('/auth/login');
        });
    }

    switchView(role) {
        this.service.changeView(role);
        this.current_role_view = role;
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
