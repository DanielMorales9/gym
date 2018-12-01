import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ChangeViewService, NotificationService, UserHelperService, UserService} from "../../shared/services";
import {AppService} from "../../app.service";
import {User} from "../../shared/model";

@Component({
    templateUrl: './profile.component.html',
    styleUrls: ['../../app.component.css'],
})
export class ProfileComponent implements OnInit {

    current_role_view: number;
    sub: any;
    user: User;

    constructor(private appService: AppService,
                private userHelperService: UserHelperService,
                private changeViewService: ChangeViewService,
                private messageService: NotificationService,
                private route: ActivatedRoute) {
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
            return this.user.roles.reduce((min,val) => Math.min(min, val.id), 3) == 3;
        }
        return true
    }

    private getUser() {
        return (user) => {
            this.user = user;
            if (!this.user.roles) {
                this.userHelperService.getRoles(user.id, (roles)  => {
                    this.user.roles = roles;
                })
            }
        }
    }


    ngOnDestroy() {
        this.sub.unsubscribe();
    }

}