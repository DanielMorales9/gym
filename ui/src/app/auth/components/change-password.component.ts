import { Component, OnInit } from '@angular/core';
import {AppService} from "../../app.service";
import {Router} from "@angular/router";

@Component({
    templateUrl: './change-password.component.html',
    styleUrls: ['../../app.component.css']
})
export class ChangePasswordComponent {

    email: string;
    error: boolean = false;
    sent: boolean = false;

    constructor(private app: AppService,
                private router: Router) {
    }

    changePassword() {
        this.app.credentials = undefined;
        this.app.findByEmail(this.email).subscribe(res => {
            this.sent = true;
        }, err => {
            this.error = true;
            console.log(err)
        })
    }

    end() {
        this.router.navigateByUrl("/home")
    }

}