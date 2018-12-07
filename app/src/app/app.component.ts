import {Component, OnInit} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import 'rxjs/add/operator/finally';
import {AppService} from "./app.service";
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
    user: User;
    authenticated: boolean;

    constructor(private appService: AppService,
                private router: Router,
                private userHelperService: UserHelperService,
                private changeViewService: ChangeViewService,
                private messageService: NotificationService) {
    }

    ngOnInit(): void {
        this.user = new User();
        this.authOnNavigation();

        this.handleMessage();
        this.changeViewService.getView().subscribe(value => {
            this.current_role_view = value;
        })
    }

    private authOnNavigation() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.appService.authenticate(undefined, (isAuthenticated) => {
                    this.authenticated = isAuthenticated;
                    if (this.authenticated) {
                        this.current_role_view = this.appService.current_role_view;
                        this.user = this.appService.user;
                    }
                }, undefined);
            }
        });
    }

    handleMessage() {
        this.messageService.getMessage().subscribe((mess) => {
            let node = document.createElement("div");
            node.className = "alert " + mess.class;
            node.innerText = mess.text;
            let delay = mess.delay || 10000;
            node.addEventListener('click', function() {
                node.remove()
            }, false);
            document.getElementById('notifications').appendChild(node);
            setTimeout(function() {
                node.remove()
            }, delay);
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
        return this.router.url === "/auth/login" || this.authenticated
    }

    hideLogout() {
        return !this.authenticated
    }

    isOnHome() {
        return this.router.url.startsWith('/home');
    }

}