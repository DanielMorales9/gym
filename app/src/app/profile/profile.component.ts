import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ChangeViewService, NotificationService, UserHelperService} from "../shared/services";
import {AppService} from "../app.service";
import {User} from "../shared/model";

@Component({
    templateUrl: './profile.component.html',
    styleUrls: ['../app.component.css'],
})
export class ProfileComponent implements OnInit {

    current_role_view: number;
    sub: any;
    user: User;

    constructor(private appService: AppService,
                private userHelperService: UserHelperService,
                private changeViewService: ChangeViewService,
                private messageService: NotificationService,
                private route: ActivatedRoute,
                private router: Router) {
        this.current_role_view = this.appService.current_role_view;
        this.changeViewService.getView().subscribe(value => this.current_role_view = value)
    }

    ngOnInit(): void {
        this.user = new User();
        this.sub = this.route.params.subscribe(params => {
            let id = +params['id?'];
            if (!!id) {
                this.userHelperService.getUser(id, this.getUser());
            }
            else {
                this.userHelperService.getUserByEmail(this.appService.user.email, this.getUser())
            }
        });
    }

    isCustomer() {
        if (!!this.user.roles) {
            if (!this.user.roles['_embedded']) {
                return this.user.roles.reduce((min,val) => Math.min(min, val.id), 3) == 3;
            }
            return true;
        }
        return true
    }

    isOnProfile() {
        if (this.router.url.match('/profile/(.*/)+user')) {
            return 'active'
        }
        return ''
    }

    navigateToProfile() {
        this.router.navigate(['profile', this.user.id, 'user']);
    }

    private getUser() {
        return (user) => {
            this.user = user;
            if (!this.user.roles) {
                this.userHelperService.getRoles(user, (roles)  => {
                    this.user.roles = roles;
                })
            }
        }
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

}