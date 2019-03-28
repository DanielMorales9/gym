import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../shared/model";
import {UserHelperService} from "../../shared/services";
import {AppService, ExchangeUserService} from "../../services";
import {ChangeViewService} from "../../services";


@Component({
    templateUrl: './user-profile.component.html',
    styleUrls: ['../../root.css'],
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
            this.getUserById(+params['id?']);
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

    private updatedUser() {
        return (user) => {
            if (this.appService.user.id == this.user.id)
                return this.appService.logout(() => this.router.navigateByUrl("/auth/login"));
            this.user = user;
            this.userHelperService.getRoles(this.user, () => {
                this.exchangeUserService.sendUser(this.user)
            });
        }
    }


    updateUser(id?) {
        if (!!id)
            this.userHelperService.getUser(id, this.updatedUser());
        else
            this.userHelperService.getUserByEmail(this.appService.user.email, this.updatedUser());
    }

    private getUserById(id?: number) {
            if (!!id)
                this.userHelperService.getUser(id, this.getUser());
            else
                this.userHelperService.getUserByEmail(this.appService.user.email, this.getUser())
        }
    }