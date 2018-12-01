import {Component, Input, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Role, User} from "../../shared/model";
import {AppService} from "../../app.service";
import {UserHelperService, UserService} from "../../shared/services";


@Component({
    selector: 'user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['../../app.component.css']
})
export class UserDetailsComponent implements OnInit {

    @Input() public user: User;
    hidden: boolean;


    constructor(private userHelperService: UserHelperService,
                private router: Router) { }

    ngOnInit(): void {
        this.hidden = false;
        if (!this.user.roles) {
            this.userHelperService.getRoles(this.user, (roles: Role[]) => {
                this.user.roles = roles;
            });
        }
    }

    toggle() {
        this.hidden = !this.hidden
    }

    getUserRole() {
        if (!!this.user.roles) {
            let minIndexRole = this.user.roles.reduce((min,val) => Math.min(min, val.id), 3);
            return this.userHelperService.INDEX2ROLE[minIndexRole]
        }
        return "CUSTOMER";
    }

    getUserCreatedAt() {
        return this.userHelperService.getUserCreatedAt(this.user)
    }

    goToUserProfile() {
        this.router.navigate(['/profile', this.user.id]);
    }

}