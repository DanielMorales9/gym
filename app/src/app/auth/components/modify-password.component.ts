import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AppService} from "../../app.service";
import {User} from "../../shared/model";

@Component({
    templateUrl: './modify-password.component.html',
    styleUrls: ['../../app.component.css']
})
export class ModifyPasswordComponent {

    token: string;
    user = new User();
    toResendToken: boolean;
    error: boolean;

    constructor(private activatedRoute: ActivatedRoute,
                private app: AppService,
                private router: Router) {
    }


    ngOnInit(): void {
        this.token = this.activatedRoute.snapshot.queryParamMap.get('token');

        this.app.getUserFromVerificationToken(this.token).subscribe( (res: User) => {
            this.user = res;
        }, (err) => {
            this.toResendToken = true;
            this.router.navigate(['/error'], {
                queryParams: { "message": err.error.message }
            })
        });
    }

    modifyPassword() {
        let userType = "";
        switch (Math.min(...this.user.defaultRoles)) {
            case 3:
                userType="customer";
                break;
            case 2:
                userType="trainer";
                break;
            case 1:
                userType="admin";
                break;
            default:
                break;
        }
        this.app.changePassword(this.user, userType).subscribe(res => {
            console.log(res)
        }, err => {
            console.log(err)
        })
    }

    resendToken() {

    }
}