import {Component, OnInit} from '@angular/core';
import {AppService, AuthenticatedService} from "../services";
import {ChangeViewService} from "../services";
import {User} from "../shared/model";
import {Router} from "@angular/router";
import {UserHelperService} from "../shared/services";

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['../app.component.css']
})
export class HomeComponent implements OnInit {

    user: User;
    current_role_view: number;
    authenticated: boolean = false;
    profilePath: string;

    constructor(private app: AppService,
                private router: Router,
                private authenticatedService : AuthenticatedService,
                private userHelper: UserHelperService,
                private changeViewService: ChangeViewService) { }

    ngOnInit() :void {
        this.authenticatedService.getAuthenticated().subscribe(auth => {
            this.authenticated = auth;
        });

        this.changeViewService.getView().subscribe(value => {
            this.current_role_view = value;
        });
        this.authenticate()
    }

    authenticate() {
        this.app.authenticate(undefined, (isAuthenticated) => {
            this.current_role_view = this.app.current_role_view;
            if (isAuthenticated) {
                let user = this.app.user;
                this.userHelper.getUserByEmail(user.email, user => {
                    this.user = user;
                    this.profilePath = "/profile/" + this.user.id;
                })
            }
        });
    }

    isOnProfile() {
        if (this.router.url.match('/profile/(.*/)+user')) {
            return 'active'
        }
        return ''
    }
}
