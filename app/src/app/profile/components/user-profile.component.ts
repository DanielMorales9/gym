import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Role, User} from "../../shared/model";
import {UserHelperService} from "../../shared/services";
import {AppService, ExchangeUserService} from "../../services";
import {ChangeViewService} from "../../services";


@Component({
    templateUrl: './user-profile.component.html',
    styleUrls: ['../../app.component.css'],
})
export class UserProfileComponent implements OnInit {

    user: User;
    current_role_view: number;

    private sub: any;

    constructor(private appService: AppService,
                private userHelperService: UserHelperService,
                private route: ActivatedRoute,
                private router: Router,
                private exchangeUserService: ExchangeUserService,
                private changeViewService: ChangeViewService) {
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
            this.userHelperService.getRoles(this.user, () => {
                this.exchangeUserService.sendUser(this.user)
            });
        }
    }

    getUserCreatedAt() {
        return UserHelperService.getUserCreatedAt(this.user)
    }

    updateUser(id) {
        if (!!id) {
            this.userHelperService.getUser(id, this.getUser());
        }
        else {
            this.userHelperService.getUserByEmail(this.appService.user.email, this.getUser())
        }
    }
}