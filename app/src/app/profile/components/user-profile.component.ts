import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {User} from "../../shared/model";
import {
    ChangeViewService,
    ExchangeUserService,
    UserHelperService
} from "../../shared/services";
import {AppService} from "../../app.service";


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
        this.sub = this.route.params.subscribe(params => {
            let id = +params['id?'];
            this.updateUser(id);
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
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

    getUserCreatedAt() {
        return this.userHelperService.getUserCreatedAt(this.user)
    }

    updateUser(id) {
        if (!!id) {
            this.userHelperService.getUser(id, this.getUser());
        }
        else {
            this.appService.getFullUser().subscribe(this.getUser())
        }
    }

    editUser() {
        this.exchangeService.sendUser(this.user);
    }
}