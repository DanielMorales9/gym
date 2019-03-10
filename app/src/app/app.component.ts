import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import 'rxjs/add/operator/finally';
import {AppService, AuthenticatedService} from "./services";
import {User} from "./shared/model";
import {NotificationService, ChangeViewService} from "./services";
import {UserHelperService} from "./shared/services";
import {MediaMatcher} from "@angular/cdk/layout";


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

    current_role_view: number;
    authenticated: boolean;
    private _mobileQueryListener: () => void;

    profilePath: string;
    user: User;
    mobileQuery: MediaQueryList;

    fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);
    constructor(private appService: AppService,
                private router: Router,
                private authenticatedService: AuthenticatedService,
                private userHelperService: UserHelperService,
                private changeViewService: ChangeViewService,
                private changeDetectorRef: ChangeDetectorRef,
                private media: MediaMatcher) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    fillerContent = Array.from({length: 50}, () =>
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
       labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
       laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
       voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
       cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`);


    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }


    ngOnInit(): void {
        this.user = new User();
        this.authOnNavigation();
        this.authenticatedService.getAuthenticated().subscribe(auth => {
            this.authenticated = auth;
        });

        this.changeViewService.getView().subscribe(value => {
            this.current_role_view = value;
        });
    }

    private authOnNavigation() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.appService.authenticate(undefined, (auth) => {
                    if (auth) {
                        this.current_role_view = this.appService.current_role_view;
                        this.user = this.appService.user;
                        this.appService.initializeWebSocketConnection();
                        this.userHelperService.getUserByEmail(this.user.email, u => {
                            this.profilePath = `profile/${u.id}/user`
                        });
                    }
                });
            }
        });
    }

    logout() {
        this.appService.logout( () => {
            this.current_role_view = undefined;
            this.authenticated = false;
            this.user = undefined;
            return this.router.navigateByUrl("/auth/login")
        })
    }

    switchView(role) {
        this.appService.changeView(role);
        this.current_role_view = role;
    }

    toHome() {
        if(!this.isOnHome()) {
            this.router.navigateByUrl('/home')
        }
    }

    hasRoles() {
        if (!!this.user && !!this.user.roles) {
            return this.user.roles && this.user.roles.length > 1
        }
        return false
    }

    hideLogin() {
        return this.router.url.startsWith("/auth") || this.authenticated
    }

    hideLogout() {
        return !this.authenticated
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