import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import { UserHelperService} from "../shared/services";
import {AppService} from "../app.service";
import {User} from "../shared/model";
import {ChangeViewService, NotificationService} from "../services";

@Component({
    templateUrl: './profile.component.html',
    styleUrls: ['../app.component.css'],
})
export class ProfileComponent implements OnInit {

    current_role_view: number;
    sub: any;
    id: number;
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
            this.id = +params['id?'];
            if (!!this.id) {
                console.log("getUser");
                this.userHelperService.getUser(this.id, this.getUser());
            }
            else {
                console.log("getUserByEmail");
                this.userHelperService.getUserByEmail(this.appService.user.email, this.getUser())
            }
        });
    }

    isCustomer() {
        if (!!this.user.roles) {
            if (!this.user.roles['_embedded'] && this.user.roles.length > 0) {
                let role = this.user.roles.reduce((min,val) => Math.min(min, val.id), 3);
                return role == 3;
            }
        }
        return false
    }

    isOnProfile() {
        if (this.router.url.match('/profile/(.*/)+user')) {
            return 'active'
        }
        return ''
    }

    navigateToProfile() {
        this.router.navigate(['profile', this.id, 'user']);
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