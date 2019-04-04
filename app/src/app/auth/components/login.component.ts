import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {AppService} from "../../services";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['../../root.css', './auth.css']
})
export class LoginComponent implements OnInit {

    error = false;
    form: FormGroup;

    credentials = {username: '', password: ''};

    constructor(private app: AppService,
                private builder: FormBuilder,
                private router: Router) {
    }

    ngOnInit(): void {
        this.buildForm()
    }

    login() {
        this.credentials.username = this.email.value;
        this.credentials.password = this.password.value;
        this.app.authenticate(this.credentials, (isAuthenticated) => {
            if (!isAuthenticated) this.error = true;
            else {
                this.error = false;
                this.router.navigateByUrl('/home');
            }
        }, _ => {
            this.error = true
        });
    }


    private buildForm() {
        this.form = this.builder.group({
            email: [this.credentials.username, [Validators.email, Validators.required]],
            password: [this.credentials.password, Validators.required]
        })
    }

    get email() {
        return this.form.get("email")
    }

    get password() {
        return this.form.get("password")
    }
}
