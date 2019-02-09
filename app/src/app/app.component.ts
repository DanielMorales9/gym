import {Component, OnInit} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import 'rxjs/add/operator/finally';
import {AppService} from "./services";
import {User} from "./shared/model";
import {NotificationService, ChangeViewService} from "./services";
import {UserHelperService} from "./shared/services";



@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    current_role_view: number;
    authenticated: boolean;
    profilePath: string;
    user: User;

    constructor(private appService: AppService,
                private router: Router,
                private userHelperService: UserHelperService,
                private changeViewService: ChangeViewService) {
    }

    ngOnInit(): void {
        this.user = new User();
        this.authOnNavigation();

        this.changeViewService.getView().subscribe(value => {
            this.current_role_view = value;
        });
    }

    private authOnNavigation() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.appService.authenticate(undefined, (isAuthenticated) => {
                    this.authenticated = isAuthenticated;
                    if (this.authenticated) {
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
            this.router.navigateByUrl("/auth/login")
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

}