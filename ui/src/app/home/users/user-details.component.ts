import {Component, Input, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {User} from "../../core/model/user.class";
import {AppService} from "../../core/services/app.service";


@Component({
    selector: 'user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['../../app.component.css']
})
export class UserDetailsComponent implements OnInit {

    @Input() public user: User;
    hidden: boolean;


    constructor(private appService : AppService,
                private router: Router) { }

    ngOnInit(): void {
        this.hidden = false;
    }

    toggle() {
        this.hidden = !this.hidden
    }

    getUserRole() {
        let minIndexRole = this.user.defaultRoles.reduce((min,val) => Math.min(min,val),
            this.user.defaultRoles[0]);
        return this.appService.INDEX2ROLE[minIndexRole]
    }

    getUserCreatedAt() {
        let date = new Date(this.user.createdAt);
        return date.toLocaleDateString();
    }

    goToUserProfile() {
        this.router.navigate(['/user', this.user.id]);
    }

}