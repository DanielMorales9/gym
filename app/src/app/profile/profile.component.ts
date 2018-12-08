import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AppService} from "../services";
import {User} from "../shared/model";
import {AuthService, ChangeViewService, NotificationService} from "../services";
import {UserHelperService} from "../shared/services";

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
                private authService: AuthService,
                private userHelperService: UserHelperService,
                private changeViewService: ChangeViewService,
                private notificationService: NotificationService,
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
                this.userHelperService.getUser(this.id, this.getUser());
            }
            else {
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
                this.userHelperService.getRoles(user)
            }
        }
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    resendToken() {
        let roleName = this.user.roles
            .reduce((prev, curr) => (prev.id < curr.id)? prev : curr)
            .name.toLowerCase();
        this.authService.resendTokenAnonymous(this.user.id).subscribe(_ => {
            this.notificationService.sendMessage({
                text: `E' stato re-inviato un token al seguente indirizzo email ${this.user.email}`,
                class: 'alert-success'
            })
        })
    }

    isAdmin() {
        if (!!this.user.roles) {
            if (!this.user.roles['_embedded'] && this.user.roles.length > 0) {
                let role = this.user.roles.reduce((min,val) => Math.min(min, val.id), 3);
                return role == 1;
            }
        }
        return false
    }
}