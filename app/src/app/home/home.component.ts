import {Component, OnInit} from '@angular/core';
import {AppService, AuthenticatedService, ChangeViewService} from '../services';
import {User} from '../shared/model';
import {Router} from '@angular/router';
import {UserHelperService} from '../shared/services';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['../styles/root.css']
})
export class HomeComponent implements OnInit {

    user: User;
    current_role_view: number;
    authenticated = false;
    profilePath: string;

    constructor(private service: AppService,
                private router: Router,
                private authenticatedService: AuthenticatedService,
                private userHelper: UserHelperService,
                private changeViewService: ChangeViewService) { }

    ngOnInit() {
        this.authenticatedService.getAuthenticated().subscribe(auth => {
            this.authenticated = auth;
            if (this.authenticated) {

                const user = this.service.user;
                this.current_role_view = this.service.current_role_view;

                this.userHelper.getUserByEmail(user.email, (u: User)=> {
                    this.user = u;
                    this.profilePath = '/profile/' + this.user.id;
                });
            }
        });

        this.changeViewService.getView().subscribe(value => {
            this.current_role_view = value;
        });

        this.service.authenticate();
    }


    isOnProfile() {
        if (this.router.url.match('/profile/(.*/)+user')) {
            return 'active';
        }
        return '';
    }
}
