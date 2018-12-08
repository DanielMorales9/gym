import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../shared/model";
import {ExchangeUserService, UserHelperService} from "../../shared/services";
import {AppService} from "../../services";
import {ChangeViewService} from "../../services";


@Component({
    templateUrl: './user-profile.component.html',
    styleUrls: ['../../app.component.css'],
})
export class UserProfileComponent implements OnInit {

    user: User;

    private sub: any;
    current_role_view: number;

    constructor(private appService: AppService,
                private userHelperService: UserHelperService,
                private route: ActivatedRoute,
                private router: Router,
                private changeViewService: ChangeViewService,
                private userExchangeService: ExchangeUserService) {
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
            this.userHelperService.getRoles(user, ()  => {
                this.userExchangeService.sendUser(this.user)
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

    editUser() {
        this.userExchangeService.sendUser(this.user);
    }

}