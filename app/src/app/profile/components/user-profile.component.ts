import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {User} from "../../shared/model";
import {
    ExchangeUserService,
    UserHelperService
} from "../../shared/services";
import {AppService} from "../../app.service";
import {ChangeViewService} from "../../services/change-view.service";


@Component({
    templateUrl: './user-profile.component.html',
    styleUrls: ['../../app.component.css'],
})
export class UserProfileComponent implements OnInit {

    user: User;
    sales: any[];

    private sub: any;
    current_role_view: number;

    constructor(private appService: AppService,
                private userHelperService: UserHelperService,
                private route: ActivatedRoute,
                private changeViewService: ChangeViewService,
                private exchangeService: ExchangeUserService) {
        this.current_role_view = this.appService.current_role_view;
        this.changeViewService.getView().subscribe(value => this.current_role_view = value)
    }

    ngOnInit(): void {
        this.user = new User();
        this.sub = this.route.parent.params.subscribe(params => {
            this.updateUser(+params['id?']);
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    private getUser() {
        return (user) => {
            this.user = user;
            if (!this.user.roles || !(this.user.roles instanceof Array)) {
                this.userHelperService.getRoles(user, (roles)  => {
                    this.user.roles = roles;
                    this.exchangeService.sendUser(this.user)
                })
            }
            else {
                this.exchangeService.sendUser(this.user)
            }
        }
    }

    getUserCreatedAt() {
        return this.userHelperService.getUserCreatedAt(this.user)
    }

    updateUser(id) {
        if (!!id) {
            console.log('getUser');
            this.userHelperService.getUser(id, this.getUser());
        }
        else {
            console.log('getUserByEmail');
            this.userHelperService.getUserByEmail(this.appService.user.email, this.getUser())
        }
    }

    editUser() {
        this.exchangeService.sendUser(this.user);
    }
}