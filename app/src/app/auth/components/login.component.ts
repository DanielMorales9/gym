import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AppService} from "../../app.service";

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['../../app.component.css']
})
export class LoginComponent {

    error = false;

    credentials = {username: '', password: ''};

    constructor(private app: AppService,
                private router: Router) {
    }

    login() {
        this.app.authenticate(this.credentials, (isAuthenticated) => {
            if (!isAuthenticated) {
                this.error = true;
            }
            else {
                this.error = false;
                this.router.navigateByUrl('/home');
            }
        }, (error) => {
            this.error = true
        });
    }

}